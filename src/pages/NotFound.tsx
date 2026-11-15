import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-24 text-center">
      <span className="font-display text-8xl font-semibold text-gold">404</span>
      <h1 className="mt-4 font-display text-3xl font-semibold">Lost in the clouds</h1>
      <p className="mt-2 text-muted">This trail doesn’t exist — but thousands of others do.</p>
      <Link to="/" className="mt-8 rounded-full bg-ember px-6 py-3 font-bold text-white">Back to base camp</Link>
    </div>
  );
}
