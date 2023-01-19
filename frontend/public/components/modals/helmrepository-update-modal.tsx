import * as _ from 'lodash-es';
import * as React from 'react';
import { Section } from '../hypercloud/utils/section';

import { createModalLauncher, ModalTitle, ModalBody, ModalSubmitFooter, ModalComponentProps } from '../factory/modal';
import { useTranslation } from 'react-i18next';
import { coFetchJSON } from '@console/internal/co-fetch';
import { HandlePromiseProps, withHandlePromise } from '../utils';

//Modal for Helm Repository Update
export const HelmRepositoryUpdateModal = withHandlePromise((props: HelmRepositoryUpdateModalProps) => {
  const submit = event => {
    event.preventDefault();
    const { updateServiceURL } = props;
    props.handlePromise(coFetchJSON.put(updateServiceURL)).then(() => {
      props.close();
    });
  };
  const { message, stringKey, name } = props;
  const { t } = useTranslation();

  return (
    <form onSubmit={submit} name="form" className="modal-content ">
      <ModalTitle>
        {t('COMMON:MSG_MAIN_ACTIONBUTTON_51', { 0: t(stringKey) })}
      </ModalTitle>
      <ModalBody className="modal-body">
        {message}
          {/* string 필요 */}
          {t('COMMON:MSG_MAIN_POPUP_DESCRIPTION_27')}
          <Section label={t('COMMON:MSG_MAIN_POPUP_DESCRIPTION_28')} id="helmRepositoryName">
          {`${name}`}
          </Section>
      </ModalBody>
      <ModalSubmitFooter errorMessage={props.errorMessage} inProgress={props.inProgress} submitText={t('COMMON:MSG_MAIN_POPUP_COMMIT_3')} cancel={props.cancel} />
    </form>
  );
});

export const helmrepositoryUpdateModal = createModalLauncher(HelmRepositoryUpdateModal);

export type HelmRepositoryUpdateModalProps = {
  message?: string,
  updateServiceURL?: string,
  stringKey?: string,
  name?: string,
} & ModalComponentProps &
  HandlePromiseProps;
