import {
  Message as PrimeMessage,
  MessageProps as PrimeMessageProps,
} from 'primereact/message';
import clsx from 'clsx';

export type MessageProps = PrimeMessageProps & {
  'data-testid'?: string;
};

const Message = ({
  className,
  'data-testid': dataTestId,
  ...props
}: MessageProps) => {
  if (dataTestId) {
    return (
      <div data-testid={dataTestId}>
        <PrimeMessage
          className={clsx('lms-message', className)} // Custom class for styling
          {...props}
        />
      </div>
    );
  }

  return (
    <PrimeMessage
      className={clsx('lms-message', className)} // Custom class for styling
      {...props}
    />
  );
};

export default Message;
