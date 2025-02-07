import { K8sResourceKind, PodKind, RouteKind } from '@console/internal/module/k8s';
import { DEPLOYMENT_STRATEGY } from '../constants';
import { OverviewItemAlerts, PodControllerOverviewItem } from './pod';
import { ClusterServiceVersionKind } from '@console/operator-lifecycle-manager';

export type APIError = {
  status?: string;
  message?: string;
  reason?: string;
  details?: {
    name?: string;
    kind?: string;
  };
  code?: number;
};

export type BuildConfigOverviewItem = K8sResourceKind & {
  builds: K8sResourceKind[];
};

export type StatusData = {
  icon: React.ReactNode;
  phase: string;
};

export type OverviewItem<T = K8sResourceKind> = {
  alerts?: OverviewItemAlerts;
  buildConfigs: BuildConfigOverviewItem[];
  current?: PodControllerOverviewItem;
  isRollingOut?: boolean;
  obj: T;
  pods?: PodKind[];
  previous?: PodControllerOverviewItem;
  routes?: RouteKind[];
  services?: K8sResourceKind[];
  status?: React.ReactNode;
  ksroutes?: K8sResourceKind[];
  configurations?: K8sResourceKind[];
  ksservices?: K8sResourceKind[];
  revisions?: K8sResourceKind[];
  isOperatorBackedService?: boolean;
  isMonitorable?: boolean;
};

export type OperatorBackedServiceKindMap = {
  [name: string]: ClusterServiceVersionKind;
};

export type DeploymentStrategy = DEPLOYMENT_STRATEGY.recreate | DEPLOYMENT_STRATEGY.rolling;
