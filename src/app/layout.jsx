import './globals.css';

export const metadata = {
  title: 'Interactive World Map',
  description: 'Explore events around the world with interactive markers and clustering',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
