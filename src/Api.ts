import * as Classes from './classes';

export namespace Api {

  export interface ClientOptions {
    /** The Rally server that requests will be made against */
    server?: string,
    /** The Rally projects ref `"/project/1234/"` that requests will be made against by default */
    project?: string,
    /** The Rally workspace ref `"/workspace/1234/"` that requests will be made against by default */
    workspace?: string
    /** Maximum concurrent requests that a client can make */
    maxConcurrentRequests?: number
    /** Maximum number of retry attempts made by a request */
    maxReadRetrys?: number
    /** Maximum number of retry attempts made by a request */
    maxWriteRetrys?: number
  }

  export interface QueryOptions {
    fetch?: string[] | boolean,
    query?: string,
    start?: number,
    pagesize?: number,
    projectScopeUp?: boolean,
    projectScopeDown?: boolean,
    compact?: boolean,
    includePermissions?: boolean,
    project?: string,
    workspace?: string,
    order?: string,
    [key: string]: any
  }

  export interface RallyObject {
    _ref?: string,
    _refObjectName?: string,
    _type?: string,
    _rallyAPIMajor?: number,
    _rallyAPIMinor?: number,
    _CreatedAt?: string,
    [x: string]: any
  }

  export interface QueryResponse<T extends RallyObject> extends Array<T> {
    $params: any,
    $hasMore: boolean,
    /** returns all the data from the later pages including this page */
    $getAll: () => Promise<QueryResponse<T>>
    /** returns the data from the next page */
    $getNextPage: () => Promise<QueryResponse<T>>
  }

  export namespace Lookback {

    export interface Request {
      find: any;
      fields?: string[] | boolean;
      hydrate?: string[];
      start?: number;
      pagesize?: number;
      removeUnauthorizedSnapshots?: boolean;
    }

    export interface Response extends Array<any> {
      $params: any,
      $hasMore: boolean,
      $rawResponse: RawResponse,
      /** returns all the data from the later pages including this page */
      $getAll: () => Promise<Lookback.Response>
      /** returns the data from the next page */
      $getNextPage: () => Promise<Lookback.Response>
    }

    export interface RawResponse {
      _rallyAPIMajor: string;
      _rallyAPIMinor: string;
      Errors: any[];
      Warnings: string[];
      GeneratedQuery: GeneratedQuery;
      TotalResultCount: number;
      HasMore: boolean;
      StartIndex: number;
      PageSize: number;
      ETLDate: string;
      ThreadStats: ThreadStats;
      Timings: Timings;
    }

    export interface Timings {
      preProcess: number;
      findEtlDate: number;
      allowedValuesDisambiguation: number;
      mongoQuery: number;
      authorization: number;
      suppressNonRequested: number;
      compressSnapshots: number;
      allowedValuesHydration: number;
      TOTAL: number;
    }

    export interface ThreadStats {
      cpuTime: string;
      waitTime: string;
      waitCount: string;
      blockedTime: string;
      blockedCount: string;
    }

    export interface GeneratedQuery {
      find: Find;
      limit: number;
      skip: number;
      fields: boolean;
    }

    export interface Find {
      ObjectID: number;
      _ValidFrom: ValidFrom;
    }

    export interface ValidFrom {
      '$lte': string;
    }

  }

}
