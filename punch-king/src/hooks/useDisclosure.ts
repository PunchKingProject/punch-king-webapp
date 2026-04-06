import * as React from 'react';

export function useDisclosure(initial = false) {
  const [open, setOpen] = React.useState<boolean>(initial);
  const onOpen = React.useCallback(() => setOpen(true), []);
  const onClose = React.useCallback(() => setOpen(false), []);
  return { open, onOpen, onClose };
}
