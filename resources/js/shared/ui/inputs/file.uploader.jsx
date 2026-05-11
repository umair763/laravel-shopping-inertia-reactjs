import React, { useCallback, useEffect, useId, useRef, useState } from "react";

/**
 * Compress an image File client-side using a canvas.
 * Returns a new File (with the original name and a derived mime) sized to maxWidth/maxHeight.
 * SVG/GIF are returned as-is (animations/vectors would be ruined by canvas).
 */
async function compressImage(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = {}) {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  let { width, height } = bitmap;
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(width, height) : Object.assign(document.createElement("canvas"), { width, height });
  if (!(canvas instanceof HTMLCanvasElement)) {
    canvas.width = width;
    canvas.height = height;
  }
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = canvas.convertToBlob
    ? await canvas.convertToBlob({ type: outputType, quality })
    : await new Promise((resolve) => canvas.toBlob(resolve, outputType, quality));

  if (!blob || blob.size >= file.size) return file; // No win — keep original

  return new File([blob], file.name.replace(/\.[^.]+$/, outputType === "image/png" ? ".png" : ".jpg"), {
    type: outputType,
    lastModified: Date.now(),
  });
}

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";

/**
 * FileUploader — reusable drag-drop file input.
 *
 * Props
 *  - value: File | File[] | null     Current selected file(s) (controlled).
 *  - onChange(next): called with a single File | null (single mode) or File[] (multiple mode).
 *  - multiple: boolean
 *  - accept: comma-separated mime types
 *  - maxSizeMB: number              Reject files larger than this before compression.
 *  - compress: boolean | object     If truthy, compress images client-side. Optional { maxWidth, maxHeight, quality }.
 *  - previewUrls: string | string[] Existing server URLs to show as previews (no upload). Single mode: a string. Multi mode: array.
 *  - onRemovePreview(url): called when an existing preview is dismissed (multi mode) so the parent can update its "retain" list.
 *  - label, hint, error, disabled
 */
export default function FileUploader({
  value,
  onChange,
  multiple = false,
  accept = DEFAULT_ACCEPT,
  maxSizeMB = 8,
  compress = true,
  previewUrls = null,
  onRemovePreview,
  label,
  hint,
  error,
  disabled = false,
  className = "",
}) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [busy, setBusy] = useState(false);

  const files = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  // ObjectURL previews for selected File objects (revoke on cleanup).
  const [objectUrls, setObjectUrls] = useState([]);
  useEffect(() => {
    const urls = files.map((f) => (f instanceof File ? URL.createObjectURL(f) : null));
    setObjectUrls(urls);
    return () => {
      urls.forEach((u) => u && URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length, files.map((f) => f?.name + f?.size).join("|")]);

  const existingPreviews = multiple
    ? Array.isArray(previewUrls)
      ? previewUrls
      : []
    : previewUrls
      ? [previewUrls]
      : [];

  const validate = useCallback(
    (file) => {
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        return `${file.name} is larger than ${maxSizeMB} MB`;
      }
      const acceptList = accept.split(",").map((s) => s.trim().toLowerCase());
      if (acceptList.length && !acceptList.includes(file.type.toLowerCase())) {
        return `${file.name} is not an accepted file type`;
      }
      return null;
    },
    [accept, maxSizeMB],
  );

  const processFiles = useCallback(
    async (incoming) => {
      setLocalError(null);
      if (!incoming.length) return;

      for (const f of incoming) {
        const err = validate(f);
        if (err) {
          setLocalError(err);
          return;
        }
      }

      setBusy(true);
      try {
        let processed = incoming;
        if (compress) {
          const opts = typeof compress === "object" ? compress : {};
          processed = await Promise.all(incoming.map((f) => compressImage(f, opts)));
        }

        if (multiple) {
          onChange?.([...files.filter((f) => f instanceof File), ...processed]);
        } else {
          onChange?.(processed[0] || null);
        }
      } finally {
        setBusy(false);
      }
    },
    [compress, files, multiple, onChange, validate],
  );

  function handleFilePick(e) {
    const incoming = Array.from(e.target.files || []);
    if (incoming.length) processFiles(incoming);
    e.target.value = ""; // allow re-selecting the same file
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const incoming = Array.from(e.dataTransfer?.files || []);
    if (incoming.length) processFiles(multiple ? incoming : [incoming[0]]);
  }

  function removeFileAt(idx) {
    if (multiple) {
      const next = [...files];
      next.splice(idx, 1);
      onChange?.(next);
    } else {
      onChange?.(null);
    }
  }

  function removeExistingPreview(url) {
    if (onRemovePreview) onRemovePreview(url);
  }

  const visibleError = error || localError;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm font-medium text-zinc-700">{label}</label>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-4 transition ${
          dragOver ? "border-sky-400 bg-sky-50" : "border-slate-200 bg-white"
        } ${disabled ? "opacity-60" : ""}`}
      >
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-slate-900">
              {multiple ? "Drop images here or browse" : "Drop an image here or browse"}
            </p>
            <p className="text-xs text-slate-500">
              {hint || `Up to ${maxSizeMB} MB. JPG, PNG, WebP, GIF, SVG.`}
            </p>
          </div>
          <label
            htmlFor={inputId}
            className={`inline-flex cursor-pointer rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 ${
              disabled ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {busy ? "Processing..." : multiple ? "Add files" : "Choose file"}
          </label>
          <input
            id={inputId}
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleFilePick}
            className="sr-only"
          />
        </div>

        {(existingPreviews.length > 0 || files.length > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {existingPreviews.map((url) => (
              <div key={`existing-${url}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={url} alt="" className="aspect-square w-full object-cover" />
                <span className="absolute left-1 top-1 rounded-full bg-slate-900/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                  Saved
                </span>
                {onRemovePreview && (
                  <button
                    type="button"
                    onClick={() => removeExistingPreview(url)}
                    className="absolute right-1 top-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {files.map((file, idx) => (
              <div key={`new-${idx}`} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {objectUrls[idx] ? (
                  <img src={objectUrls[idx]} alt={file.name} className="aspect-square w-full object-cover" />
                ) : (
                  <div className="aspect-square w-full" />
                )}
                <span className="absolute left-1 top-1 rounded-full bg-sky-600/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">
                  New
                </span>
                <button
                  type="button"
                  onClick={() => removeFileAt(idx)}
                  className="absolute right-1 top-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                >
                  Remove
                </button>
                <div className="absolute inset-x-0 bottom-0 truncate bg-slate-900/60 px-2 py-1 text-[10px] text-white">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {visibleError && <p className="text-sm text-rose-600">{visibleError}</p>}
    </div>
  );
}
