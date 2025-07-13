// src/components/LayoutWithExit.tsx
import { Outlet } from 'react-router-dom';
import ExitButton from './ExitButton';

function LayoutWithExit() {
  return (
    <>
      <Outlet />
      <ExitButton />
    </>
  );
}

export default LayoutWithExit;
