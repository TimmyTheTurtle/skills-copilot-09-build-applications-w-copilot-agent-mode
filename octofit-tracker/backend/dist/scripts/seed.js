import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        console.log('Seed the octofit_db database with test data');
        await Promise.all([
            Activity.deleteMany({}),
            LeaderboardEntry.deleteMany({}),
            Workout.deleteMany({}),
            Team.deleteMany({}),
            User.deleteMany({}),
        ]);
        const users = await User.insertMany([
            {
                username: 'alex_runner',
                email: 'alex.runner@example.com',
                displayName: 'Alex Rivera',
                avatarColor: '#2563eb',
                bio: 'Morning runner building toward a first half marathon.',
            },
            {
                username: 'maya_lifts',
                email: 'maya.lifts@example.com',
                displayName: 'Maya Chen',
                avatarColor: '#16a34a',
                bio: 'Strength-training regular who tracks every rep.',
            },
            {
                username: 'sam_cycles',
                email: 'sam.cycles@example.com',
                displayName: 'Sam Patel',
                avatarColor: '#f97316',
                bio: 'Weekend cyclist chasing steady endurance gains.',
            },
        ]);
        const teams = await Team.insertMany([
            {
                name: 'Octo Striders',
                motto: 'Eight arms, one pace.',
                city: 'Seattle',
                members: [users[0]._id, users[2]._id],
            },
            {
                name: 'Core Current',
                motto: 'Stronger with every set.',
                city: 'Portland',
                members: [users[1]._id],
            },
        ]);
        await Activity.insertMany([
            {
                user: users[0]._id,
                team: teams[0]._id,
                type: 'Run',
                durationMinutes: 42,
                distanceMiles: 4.8,
                caloriesBurned: 465,
                completedAt: new Date('2026-09-14T13:15:00Z'),
            },
            {
                user: users[1]._id,
                team: teams[1]._id,
                type: 'Strength Training',
                durationMinutes: 55,
                distanceMiles: 0,
                caloriesBurned: 390,
                completedAt: new Date('2026-09-15T22:30:00Z'),
            },
            {
                user: users[2]._id,
                team: teams[0]._id,
                type: 'Cycling',
                durationMinutes: 76,
                distanceMiles: 18.4,
                caloriesBurned: 720,
                completedAt: new Date('2026-09-16T12:00:00Z'),
            },
        ]);
        await LeaderboardEntry.insertMany([
            { user: users[2]._id, team: teams[0]._id, rank: 1, points: 1840, weeklyGoalCompletion: 116 },
            { user: users[0]._id, team: teams[0]._id, rank: 2, points: 1615, weeklyGoalCompletion: 104 },
            { user: users[1]._id, team: teams[1]._id, rank: 3, points: 1430, weeklyGoalCompletion: 96 },
        ]);
        await Workout.insertMany([
            {
                title: 'Tempo Builder',
                focus: 'Cardio endurance',
                difficulty: 'Intermediate',
                durationMinutes: 35,
                recommendedFor: [users[0]._id, users[2]._id],
                exercises: ['Warm-up jog', 'Tempo intervals', 'Cool-down walk'],
            },
            {
                title: 'Foundational Strength',
                focus: 'Full-body strength',
                difficulty: 'Beginner',
                durationMinutes: 40,
                recommendedFor: [users[1]._id],
                exercises: ['Goblet squats', 'Dumbbell rows', 'Plank holds'],
            },
            {
                title: 'Mobility Reset',
                focus: 'Recovery',
                difficulty: 'All levels',
                durationMinutes: 22,
                recommendedFor: users.map((user) => user._id),
                exercises: ['Hip openers', 'Thoracic rotations', 'Hamstring flossing'],
            },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
