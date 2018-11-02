import { delay } from 'roadhog-api-doc';
import LoginHandler from './mock/login';
import Moisture from './mock/moisture';
import MoistureHistory from './mock/moistureHistory';
import Wells from './mock/wells';
import WellsHistory from './mock/wellsHistory';
import Meteorology from './mock/meteorology';
import MeteorologyHistory from './mock/meteorologyHistory';
import Ball from './mock/ball';
import BallHistory from './mock/ballHistory';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const proxy = {
    // 'POST /api/login': LoginHandler,
    // 'POST /api/data/moisture': Moisture,
    // 'POST /api/data/moisture/history': MoistureHistory,
    // 'POST /api/data/wells': Wells,
    // 'POST /api/data/wells/history': WellsHistory,
    // 'POST /api/data/meteorology': Meteorology,
    // 'POST /api/data/meteorology/history': MeteorologyHistory,
    // 'POST /api/data/ball': Ball,
    // 'POST /api/data/ball/history': BallHistory,
}
export default (noProxy ? {} : delay(proxy, 1000));
