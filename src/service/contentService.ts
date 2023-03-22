import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllContent = async () => {
    const data = await prisma.contents.findMany({

    })

    return data
}

const getJellyContent = async () => {
    const data = await prisma.contents.findMany({
        
    });
    const shuffle = data.sort(() => 0.5 - Math.random());
    const randomContent = shuffle.slice(0,5)
    return randomContent
}


const userService = {
    getAllContent,
    getJellyContent
};

export default userService;
