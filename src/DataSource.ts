import defaults from 'lodash/defaults';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { MyQuery, MyDataSourceOptions, defaultQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    // Boiler plate query data built by yarn install-ing the template for a plugin provided by Grafana.

    // Return a constant for each query.
    // const data = options.targets.map(target => {
    //   const query = defaults(target, defaultQuery);
    //   return new MutableDataFrame({
    //     refId: query.refId,
    //     fields: [
    //       { name: 'Time', values: [from, to], type: FieldType.time },
    //       { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
    //     ],
    //   });
    // });

    // Return a constant for each query.
    const data = options.targets.map(target => {
      const query = defaults(target, defaultQuery);
      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          { name: 'time', type: FieldType.time },
          { name: 'value', type: FieldType.number },
        ],
      });

      // duration of the time range, in milliseconds
      const duration = to - from;

      // step determines how close in time (ms) the points will be to each other
      const step = duration / 1000;

      for (let t = 0; t < duration; t += step) {
        frame.add({ time: from + t, value: Math.sin((2 * Math.PI * t) / duration) });
      }
      return frame;
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
