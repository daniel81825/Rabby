import { Button, Tooltip } from 'antd';
import React from 'react';
import { ActionsContainer, Props } from './ActionsContainer';
import clsx from 'clsx';

export const ProcessActions: React.FC<Props> = ({
  onSubmit,
  onCancel,
  disabledProcess,
  tooltipContent,
}) => {
  return (
    <ActionsContainer onCancel={onCancel}>
      <Tooltip
        overlayClassName="rectangle sign-tx-forbidden-tooltip"
        title={tooltipContent}
      >
        <div className="absolute left-0 right-0">
          <Button
            disabled={disabledProcess}
            type="ghost"
            className={clsx(
              'w-[244px] h-[48px] border-blue-light text-blue-light',
              'hover:bg-[#8697FF1A] active:bg-[#0000001A]',
              'disabled:bg-transparent disabled:opacity-40 disabled:hover:bg-transparent',
              'rounded-[8px]',
              'before:content-none'
            )}
            onClick={onSubmit}
          >
            Begin signing process
          </Button>
        </div>
      </Tooltip>
    </ActionsContainer>
  );
};
