import {
  Toast as PrimeToast,
  ToastProps as PrimeToastProps,
  ToastMessage,
} from 'primereact/toast';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

export interface ToastRef {
  show(message: ToastMessage | ToastMessage[]): void;
  clear(): void;
  replace(message: ToastMessage | ToastMessage[]): void;
}

export type ToastProps = PrimeToastProps;

const Toast = forwardRef<ToastRef, ToastProps>(
  ({ className, ...props }, ref) => {
    const toastRef = useRef<PrimeToast>(null);

    useImperativeHandle(ref, () => ({
      show: (message) => toastRef.current?.show(message),
      clear: () => toastRef.current?.clear(),
      replace: (message) => toastRef.current?.replace(message),
    }));

    return (
      <PrimeToast
        ref={toastRef}
        className={clsx('lms-toast', className)} // Custom class for styling
        {...props}
      />
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;
