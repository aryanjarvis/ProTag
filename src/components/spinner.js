import React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Label } from '@fluentui/react/lib/Label';
import { Stack } from '@fluentui/react/lib/Stack';

export const SpinnerLoading = () => {
  // This is just for laying out the label and spinner (spinners don't have to be inside a Stack)
  const rowProps = { horizontal: true, verticalAlign: 'center' };

  const tokens = {
    sectionStack: {
      childrenGap: 10,
    },
    spinnerStack: {
      childrenGap: 20,
    },
  };

  return (
    <Stack tokens={tokens.sectionStack}>
      <Stack {...rowProps} tokens={tokens.spinnerStack}>
        <Label style={{fontSize:'20px',margin:'20px',fontFamily: 'Poppins'}}>Worth the Wait...</Label>
        <Spinner size={SpinnerSize.large} />
      </Stack>
    </Stack>
  );
};
