import * as _ from 'lodash-es';
import * as React from 'react';
import * as classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { K8sResourceKind } from '../../module/k8s';
import { DetailsPage, ListPage } from '../factory';
import { Kebab, KebabAction, detailsPage, Timestamp, navFactory, ResourceKebab, ResourceLink, ResourceSummary, SectionHeading } from '../utils';
import { DestinationRuleModel } from '../../models';
import { ResourceLabel } from '../../models/hypercloud/resource-plural';
import { TableProps } from './utils/default-list-component';

export const menuActions: KebabAction[] = [...Kebab.getExtensionsActionsForKind(DestinationRuleModel), ...Kebab.factory.common];

const kind = DestinationRuleModel.kind;

const tableProps: TableProps = {
  header: [
    {
      title: 'COMMON:MSG_MAIN_TABLEHEADER_1',
      sortField: 'metadata.name',
    },
    {
      title: 'COMMON:MSG_MAIN_TABLEHEADER_2',
      sortField: 'metadata.namespace',
    },
    {
      title: 'COMMON:MSG_MAIN_TABLEHEADER_28',
      sortField: 'spec.hosts',
    },
    {
      title: 'COMMON:MSG_MAIN_TABLEHEADER_12',
      sortField: 'metadata.creationTimestamp',
    },
    {
      title: '',
      transforms: null,
      props: { className: Kebab.columnClass },
    },
  ],
  row: (obj: K8sResourceKind) => [
    {
      children: <ResourceLink kind={kind} name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.uid} />,
    },
    {
      children: <ResourceLink kind="Namespace" name={obj.metadata.namespace} title={obj.metadata.namespace} />,
    },
    {
      className: classNames('pf-m-hidden', 'pf-m-visible-on-sm', 'co-break-word'),
      children: obj.spec.host,
    },
    {
      children: <Timestamp timestamp={obj.metadata.creationTimestamp} />,
    },
    {
      className: Kebab.columnClass,
      children: <ResourceKebab actions={menuActions} kind={kind} resource={obj} />,
    },
  ],
};

const DestinationRuleDetails: React.FC<DestinationRuleDetailsProps> = ({ obj: destinationrule }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="co-m-pane__body">
        <SectionHeading text={t('COMMON:MSG_DETAILS_TABDETAILS_DETAILS_1', { 0: ResourceLabel(destinationrule, t) })} />
        <div className="row">
          <div className="col-lg-6">
            <ResourceSummary resource={destinationrule} />
          </div>
        </div>
      </div>
      <div className="co-m-pane__body"></div>
    </>
  );
};

const { details, editResource } = navFactory;

export const DestinationRulesPage: React.FC = props => {
  return <ListPage canCreate={true} tableProps={tableProps} kind={kind} {...props} />;
};

export const DestinationRulesDetailsPage: React.FC<DestinationRulesDetailsPageProps> = props => <DetailsPage {...props} kind={kind} menuActions={menuActions} pages={[details(detailsPage(DestinationRuleDetails)), editResource()]} />;

type DestinationRuleDetailsProps = {
  obj: K8sResourceKind;
};

type DestinationRulesDetailsPageProps = {
  match: any;
};
