import * as React from 'react';
import { Timestamp } from '../utils';
import { CamelCaseWrap } from '../utils/camel-case-wrap';
import { K8sResourceCondition } from '../../module/k8s';
import { useTranslation } from 'react-i18next';

export const ServiceBindingConditions: React.SFC<ConditionsProps> = ({ conditions, showReason = true, showMessage = true }) => {
  const { t } = useTranslation();
  const rows = conditions?.map?.((condition: K8sResourceCondition, i: number) => (
    <div className="row" data-test-id={condition.type} key={i}>
      <div className="col-xs-4 col-sm-2 col-md-2">
        <CamelCaseWrap value={condition.type} />
      </div>
      <div className="col-xs-4 col-sm-2 col-md-2" data-test-id="status">
        {condition.status}
      </div>
      {showReason && (
        <div className="col-xs-4 col-sm-3 col-md-2">
          <CamelCaseWrap value={condition.reason} />
        </div>
      )}
      <div className="hidden-xs hidden-sm col-md-2">
        <Timestamp timestamp={condition.lastTransitionTime} />
      </div>
      {/* remove initial newline which appears in route messages */}
      {showMessage && <div className="hidden-xs col-sm-5 col-md-4 co-break-word co-pre-line co-conditions__message">{condition.message?.trim() || '-'}</div>}
    </div>
  ));

  return (
    <>
      {conditions?.length ? (
        <div className="co-m-table-grid co-m-table-grid--bordered">
          <div className="row co-m-table-grid__head">
            <div className="col-xs-4 col-sm-2 col-md-2">{t('SINGLE:MSG_SERVICEBINDINGS_SERVICEBINDINGDETAILS_TABDETAILS_CONDITIONS_2')}</div>
            <div className="col-xs-4 col-sm-2 col-md-2">{t('SINGLE:MSG_SERVICEBINDINGS_SERVICEBINDINGDETAILS_TABDETAILS_CONDITIONS_3')}</div>
            {showReason && <div className="col-xs-4 col-sm-3 col-md-2">{t('SINGLE:MSG_SERVICEBINDINGS_SERVICEBINDINGDETAILS_TABDETAILS_CONDITIONS_4')}</div>}
            <div className="hidden-xs hidden-sm col-md-2">{t('SINGLE:MSG_SERVICEBINDINGS_SERVICEBINDINGDETAILS_TABDETAILS_CONDITIONS_5')}</div>
            {showMessage && <div className="hidden-xs col-sm-5 col-md-4">{t('SINGLE:MSG_SERVICEBINDINGS_SERVICEBINDINGDETAILS_TABDETAILS_CONDITIONS_6')}</div>}
          </div>
          <div className="co-m-table-grid__body">{rows}</div>
        </div>
      ) : (
        <div className="cos-status-box">
          <div className="text-center">{t('COMMON:MSG_DETAILS_TABDETAILS_CONDITIONS_2')}</div>
        </div>
      )}
    </>
  );
};

export type ConditionsProps = {
  conditions: K8sResourceCondition[];
  showReason?: boolean;
  showMessage?: boolean;
  title?: string;
  subTitle?: string;
};
