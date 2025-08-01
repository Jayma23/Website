// public/js/app.js
const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinaryWeb(file, index) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  answers.photos[index] = data.secure_url;
  renderCurrentStep();
  updateNextButtonState();
  showNotification('Photo uploaded successfully!', 'success');
}
