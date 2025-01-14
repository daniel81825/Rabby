import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { StrayPageWithButton } from 'ui/component';
import { hasConnectedLedgerDevice } from '@/utils';
import { HARDWARE_KEYRING_TYPES } from 'consts';
import './style.less';
import { query2obj } from '@/ui/utils/url';

const LedgerConnect = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { search } = useLocation();

  const qs = query2obj(search);
  const isReconnect = !!qs.reconnect;

  const onSubmit = async () => {
    const supportWebHID = await TransportWebHID.isSupported();
    const hasConnectedLedger = await hasConnectedLedgerDevice();

    if (isReconnect) {
      history.push({
        pathname: '/request-permission',
        search: '?type=ledger&reconnect=1',
      });
      return;
    }

    if (!supportWebHID) {
      history.push({
        pathname: '/import/select-address',
        state: {
          keyring: HARDWARE_KEYRING_TYPES.Ledger.type,
          isWebHID: false,
          ledgerLive: true,
        },
      });
    } else {
      if (hasConnectedLedger) {
        history.push({
          pathname: '/import/select-address',
          state: {
            keyring: HARDWARE_KEYRING_TYPES.Ledger.type,
            isWebHID: true,
            ledgerLive: false,
          },
        });
      } else {
        history.push({
          pathname: '/request-permission',
          search: '?type=ledger',
        });
      }
    }
  };

  return (
    <StrayPageWithButton
      header={{
        title: t('Connect Ledger'),
        center: true,
      }}
      className="stray-page-wide"
      headerClassName="mb-40"
      onSubmit={onSubmit}
      hasBack={false}
      footerFixed={false}
    >
      <div className="connect-ledger">
        <ul className="list-decimal w-[180px] pl-[20px] m-auto text-gray-title text-14 leading-[20px] mb-[50px]">
          <li>Plug in a single Ledger</li>
          <li>Enter pin to unlock</li>
          <li>Open Ethereum App</li>
        </ul>
        <img src="/images/ledger-plug.png" className="ledger-plug" />
      </div>
    </StrayPageWithButton>
  );
};

export default LedgerConnect;
