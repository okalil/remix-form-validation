import { Link } from '@remix-run/react';

export default function SuccessRoute() {
  return (
    <div>
      <h1>Enviado com Sucesso!</h1>
      <Link to="/">Voltar para o inicío</Link>
    </div>
  );
}
