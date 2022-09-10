import { ActionFunction, LinksFunction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { useState } from 'react';

import styles from '~/styles/global.css';

export const links: LinksFunction = () => [{ href: styles, rel: 'stylesheet' }];

export default function Index() {
  return (
    <div>
      <Link to="/anunciar">Anunciar</Link>
    </div>
  );
}
