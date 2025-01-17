import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import { useDebounce } from 'react-use';
import { useWallet } from 'ui/utils';
import { CHAINS_ENUM, CHAINS } from 'consts';
import { Popup, PageHeader } from 'ui/component';
import { isValidateUrl } from 'ui/utils/url';
import { RPCItem } from '@/background/service/rpc';

const ErrorMsg = styled.div`
  color: #ec5151;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-top: 8px;
`;

const Footer = styled.div`
  height: 76px;
  background: #ffffff;
  border-top: 1px solid #e5e9ef;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  position: absolute;
  left: -20px;
  bottom: 0;
`;

const EditRPCWrapped = styled.div`
  position: relative;
  height: 100%;
  .rpc-input {
    height: 52px;
    width: 360px;
    margin-left: auto;
    margin-right: auto;
    background: #f5f6fa;
    border: 1px solid #e5e9ef;
    border-radius: 6px;
    &.has-error {
      border-color: #ec5151;
    }
  }
`;

const EditRPCModal = ({
  chain,
  rpcInfo,
  visible,
  onCancel,
  onConfirm,
}: {
  chain: CHAINS_ENUM;
  rpcInfo: { id: CHAINS_ENUM; rpc: RPCItem } | null;
  visible: boolean;
  onCancel(): void;
  onConfirm(url: string): void;
}) => {
  const wallet = useWallet();
  const chainInfo = useMemo(() => {
    return CHAINS[chain];
  }, [chain]);
  const [rpcUrl, setRpcUrl] = useState('');
  const [rpcErrorMsg, setRpcErrorMsg] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const canSubmit = useMemo(() => {
    return rpcUrl && !rpcErrorMsg && !isValidating;
  }, [rpcUrl, rpcErrorMsg, isValidating]);

  const inputRef = useRef<Input>(null);

  const handleRPCChanged = (url: string) => {
    setRpcUrl(url);
    if (!isValidateUrl(url)) {
      setRpcErrorMsg('Invalid RPC URL');
    }
  };

  const rpcValidation = async () => {
    if (!isValidateUrl(rpcUrl)) {
      return;
    }
    try {
      setIsValidating(true);
      const isValid = await wallet.validateRPC(rpcUrl, chainInfo.id);
      setIsValidating(false);
      if (!isValid) {
        setRpcErrorMsg('Invalid Chain ID');
      } else {
        setRpcErrorMsg('');
      }
    } catch (e) {
      setIsValidating(false);
      setRpcErrorMsg('RPC authentication failed');
    }
  };

  useDebounce(rpcValidation, 200, [rpcUrl]);

  useEffect(() => {
    if (rpcInfo) {
      setRpcUrl(rpcInfo.rpc.url);
    } else {
      setRpcUrl('');
    }
  }, [rpcInfo]);

  useEffect(() => {
    if (!visible) {
      setRpcUrl('');
      setRpcErrorMsg('');
    }
    setTimeout(() => {
      inputRef.current?.input?.focus();
    });
  }, [visible]);

  return (
    <Popup
      height={440}
      visible={visible}
      onCancel={onCancel}
      bodyStyle={{
        paddingBottom: 0,
      }}
      style={{
        zIndex: 1001,
      }}
    >
      <EditRPCWrapped>
        <PageHeader forceShowBack onBack={onCancel} className="pt-0">
          Edit RPC
        </PageHeader>
        <div className="text-center">
          <img
            className="w-[56px] h-[56px] mx-auto mb-12"
            src={chainInfo.logo}
          />
          <div className="mb-8 text-20 text-gray-title leading-none">
            {chainInfo.name}
          </div>
          <div className="mb-8 text-14 text-gray-title text-left">RPC URL</div>
        </div>
        <Input
          ref={inputRef}
          className={clsx('rpc-input', { 'has-error': rpcErrorMsg })}
          value={rpcUrl}
          placeholder="Enter the RPC URL"
          onChange={(e) => handleRPCChanged(e.target.value)}
        />
        {rpcErrorMsg && <ErrorMsg>{rpcErrorMsg}</ErrorMsg>}
        <Footer>
          <Button
            type="primary"
            size="large"
            className="rabby-btn-ghost w-[172px]"
            ghost
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            loading={isValidating}
            size="large"
            className="w-[172px]"
            disabled={!canSubmit}
            onClick={() => onConfirm(rpcUrl)}
          >
            {isValidating ? 'Loading' : 'Save'}
          </Button>
        </Footer>
      </EditRPCWrapped>
    </Popup>
  );
};

export default EditRPCModal;
