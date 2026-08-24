export function loginIllustrationSrc() {
  const day = new Date().getDate();
  const n = String(((day - 1) % 31) + 1).padStart(2, '0');
  return `https://raw.githubusercontent.com/melancholic-ksm/cool-login-page-illustration-images/main/login-illust/${n}.png`;
}

