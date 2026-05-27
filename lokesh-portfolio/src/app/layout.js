import './globals.css';

export const metadata = {
  title: 'Lokesh Kumar G — Software Developer & AI Builder',
  description: 'The Interactive Digital Mind of Lokesh Kumar G. Building systems today for the freedom of tomorrow.',
  keywords: ['Lokesh Kumar', 'Software Developer', 'AI Automation', 'React', 'Portfolio'],
  openGraph: {
    title: 'Lokesh Kumar G — Digital Mind',
    description: 'Building systems today for the freedom of tomorrow.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cyber-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
