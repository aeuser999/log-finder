import { LogFinderFn, LogFinderMapper, LogFinderRule, ReturningLogFinderMapper, ReturningLogFinderTransformer } from './types';
export declare const createLogFinder: (logFindRule: LogFinderRule, callback: LogFinderFn) => LogFinderMapper;
export declare const createReturningLogFinder: <TransformOutputType = any>(logFindRule: LogFinderRule, transform?: ReturningLogFinderTransformer<TransformOutputType> | undefined) => ReturningLogFinderMapper<TransformOutputType>;
