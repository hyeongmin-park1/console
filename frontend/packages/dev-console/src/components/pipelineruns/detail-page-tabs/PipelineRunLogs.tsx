import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import { StatusIcon } from '@console/shared';
import { Firehose, resourcePathFromModel } from '@console/internal/components/utils';
//import { pipelineRunFilterReducer } from '../../../utils/pipeline-filter-reducer';
import { PipelineRun } from '../../../utils/pipeline-augment';
import { PipelineRunModel } from '../../../../../../../frontend/public/models/index';
import LogsWrapperComponent from '../logs/LogsWrapperComponent';
import { getDownloadAllLogsCallback } from '../logs/logs-utils';
import './PipelineRunLogs.scss';
import { withTranslation } from 'react-i18next';

/*
interface PipelineRunLogsProps {
  obj: PipelineRun;
  activeTask?: string;
}
*/
interface PipelineRunLogsState {
  activeItem: string;
  navUntouched: boolean;
}
class PipelineRunLogs_ extends React.Component<any, PipelineRunLogsState> {
  constructor(props) {
    super(props);
    this.state = { activeItem: null, navUntouched: true };
  }

  componentDidMount() {
    const { obj, activeTask } = this.props;
    const taskRunFromYaml = _.merge(_.get(obj, ['status', 'taskRuns'], {}), _.get(obj, ['status', 'runs'], {}));
    const taskRuns = this.getSortedTaskRun(taskRunFromYaml);
    const activeItem = this.getActiveTaskRun(taskRuns, activeTask);
    this.setState({ activeItem });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.obj !== nextProps.obj) {
      const { obj, activeTask } = this.props;
      const taskRunFromYaml = _.merge(_.get(obj, ['status', 'taskRuns'], {}), _.get(obj, ['status', 'runs'], {}));
      const taskRuns = this.getSortedTaskRun(taskRunFromYaml);
      const activeItem = this.getActiveTaskRun(taskRuns, activeTask);
      this.state.navUntouched && this.setState({ activeItem });
    }
  }

  getActiveTaskRun = (taskRuns: string[], activeTask: string): string =>
    activeTask
      ? taskRuns.find((taskRun) => taskRun.includes(activeTask))
      : taskRuns[taskRuns.length - 1];

  getSortedTaskRun = (taskRunFromYaml) => {
    const taskRuns = Object.keys(taskRunFromYaml).sort((a, b) => {
      if (_.get(taskRunFromYaml, [a, 'status', 'completionTime'], false)) {
        return taskRunFromYaml[b].status.completionTime &&
          new Date(taskRunFromYaml[a].status.completionTime) >
            new Date(taskRunFromYaml[b].status.completionTime)
          ? 1
          : -1;
      }
      return taskRunFromYaml[b].status.completionTime ||
        new Date(taskRunFromYaml[a].status?.startTime) >
          new Date(taskRunFromYaml[b].status?.startTime)
        ? 1
        : -1;
    });
    return taskRuns;
  };

  onNavSelect = (item) => {
    this.setState({
      activeItem: item.itemId,
      navUntouched: false,
    });
  };

  render() {
    const { obj, t } = this.props;
    const { activeItem } = this.state;
    const taskRunFromYaml = _.merge(_.get(obj, ['status', 'taskRuns'], {}), _.get(obj, ['status', 'runs'], {}));
    const taskRuns = this.getSortedTaskRun(taskRunFromYaml);

    const taskCount = taskRuns.length;
    const downloadAllCallback =
      taskCount > 1
        ? getDownloadAllLogsCallback(
            taskRuns,
            taskRunFromYaml,
            obj.metadata?.namespace,
            obj.metadata?.name,
          )
        : undefined;
    const resources = taskCount > 0 && [
      {
        name: _.get(taskRunFromYaml[activeItem], ['status', 'podName'], ''),
        kind: 'Pod',
        namespace: obj.metadata.namespace,
        prop: `obj`,
        isList: false,
      },
    ];
    const path = `${resourcePathFromModel(
      PipelineRunModel,
      obj.metadata.name,
      obj.metadata.namespace,
    )}/logs/`;
    return (
      <div className="odc-pipeline-run-logs">
        <div className="odc-pipeline-run-logs__tasklist" data-test-id="logs-tasklist">
          {taskCount > 0 ? (
            <Nav onSelect={this.onNavSelect}>
              <NavList className="odc-pipeline-run-logs__nav">
                {taskRuns.map((task) => {
                  return (
                    <NavItem
                      key={task}
                      itemId={task}
                      isActive={activeItem === task}
                      className="odc-pipeline-run-logs__navitem"
                    >
                      <Link to={path + _.get(taskRunFromYaml, [task, `pipelineTaskName`], '-')}>
                        <StatusIcon
                          status={taskReducer(
                            _.merge(_.get(obj, ['status', 'taskRuns'], {}), _.get(obj, ['status', 'runs'], {})),
                            task,
                          )}
                        />
                        <span className="odc-pipeline-run-logs__namespan">
                          {_.get(taskRunFromYaml, [task, `pipelineTaskName`], '-')}
                        </span>
                      </Link>
                    </NavItem>
                  );
                })}
              </NavList>
            </Nav>
          ) : (
            <div className="odc-pipeline-run-logs__nav">No Task Runs Found</div>
          )}
        </div>
        <div className="odc-pipeline-run-logs__container">
          {activeItem && resources[0].name ? (
            <Firehose key={activeItem} resources={resources}>
              <LogsWrapperComponent
                taskName={_.get(taskRunFromYaml, [activeItem, 'pipelineTaskName'], '-')}
                downloadAllLabel={t('COMMON:MSG_DETAILS_TABLOGS_23')}
                onDownloadAll={downloadAllCallback}
              />
            </Firehose>
          ) : (
            <>
              <div className="odc-pipeline-run-logs__taskName">
                {_.get(taskRunFromYaml, [activeItem, 'pipelineTaskName'], '-')}
              </div>
              <div className="odc-pipeline-run-logs__log">
                <span className="odc-pipeline-run-logs__message">No Logs Found</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
const PipelineRunLogs = withTranslation()(PipelineRunLogs_);

type PipelineRunLogsWithActiveTaskProps = {
  obj: PipelineRun;
  params?: RouteComponentProps;
};

const taskStatus = (tasks, taskName): string => {  
  const conditions = _.get(tasks, [taskName, 'status', 'conditions'], []);
  const isCancelled = conditions.find((c) =>
    ['PipelineRunCancelled', 'TaskRunCancelled'].some((cancel) => cancel === c.reason),
  );
  if (isCancelled) {
    return 'Cancelled';
  }
  if (conditions.length === 0) return null;

  const condition = conditions.find((c) => c.type === 'Succeeded');
  return !condition || !condition.status
    ? null
    : condition.status === 'True'
    ? 'Completed'
    : condition.status === 'False'
    ? 'Failed'
    : 'Running';
};

const taskReducer = (tasks, taskName): string => {
  const status = taskStatus(tasks, taskName);
  return status || '-';
};

export const PipelineRunLogsWithActiveTask: React.FC<PipelineRunLogsWithActiveTaskProps> = ({
  obj,
  params,
}) => {
  const activeTask = _.get(params, 'match.params.name');
  return <PipelineRunLogs obj={obj} activeTask={activeTask} />;
};

export default PipelineRunLogs;
