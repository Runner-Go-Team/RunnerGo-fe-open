import EventApi from './api';
import EventWait from './wait';
import EventIf from './if';
import EventFor from './for';
import EventBegin from './begin';
import EventWhile from './while';
import EventAssert from './assert';
import EventScript from './script';
import EventRequest from './request';

export default {
  api: EventApi,
  wait: EventWait,
  if: EventIf,
  for: EventFor,
  while: EventWhile,
  begin: EventBegin,
  assert: EventAssert,
  script: EventScript,
  request: EventRequest,
};
