import { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import styles from '~/styles/global.css';

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

export default function Index() {
  return (
    <div className="center">
      <Link to="/anunciar" className="btn">
        Anunciar
      </Link>
    </div>
  );
}
