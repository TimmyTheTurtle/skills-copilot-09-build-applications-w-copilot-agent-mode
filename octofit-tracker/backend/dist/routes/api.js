import { Router } from 'express';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';
export const apiRouter = Router();
const createResourceRouter = (loadData) => {
    const router = Router();
    router.get('/', async (_request, response, next) => {
        try {
            response.json(await loadData());
        }
        catch (error) {
            next(error);
        }
    });
    return router;
};
apiRouter.use('/users', createResourceRouter(() => User.find().sort({ displayName: 1 })));
apiRouter.use('/teams', createResourceRouter(() => Team.find().populate('members', 'displayName username').sort({ name: 1 })));
apiRouter.use('/activities', createResourceRouter(() => Activity.find()
    .populate('user', 'displayName username')
    .populate('team', 'name')
    .sort({ completedAt: -1 })));
apiRouter.use('/leaderboard', createResourceRouter(() => LeaderboardEntry.find()
    .populate('user', 'displayName username')
    .populate('team', 'name')
    .sort({ rank: 1 })));
apiRouter.use('/workouts', createResourceRouter(() => Workout.find().populate('recommendedFor', 'displayName username').sort({ title: 1 })));
