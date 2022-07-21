import {bloggersCollection, commentsCollection, postsCollection, usersCollection} from "../db";

export const deleteAllDataFromDB = async () => {
    await usersCollection.deleteMany({})
    await bloggersCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await commentsCollection.deleteMany({})
}