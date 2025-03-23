interface ErrorHandlerProps {
  fileLocation: string;
  functionName: string;
  lineError?: number;
  message?: string;
}

export const consoleLogger = ({
  fileLocation,
  functionName,
  lineError,
  message,
}: ErrorHandlerProps) => {
  console.log(`
    Error File: ${fileLocation}
    Function Name: ${functionName}
    Line: ${lineError}
    Message: ${message || 'No message provided'}
    `);
};
