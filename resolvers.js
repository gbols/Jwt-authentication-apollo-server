const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decodedToken } = require('./decodedToken');


const resolvers = {
  Query: {
    users: async (root, args, { prisma, req }, info) => { 
        const decoded = decodedToken(req);
        return prisma.users();
    },
  },
  Mutation: {
    signupUser: async (root, args, { prisma }, info) => {
        const { data: { email, name, password } } = args;
        const newUser = await prisma.createUser({
          email,
          name,
          password: bcrypt.hashSync(password, 3)
        });

        return {token : jwt.sign(newUser, "supersecret")};
    },
    loginUser: async (root, args, { prisma }, info)  => {
      const { data: { email, password } } = args;
      const [ theUser ] = await prisma.users({
        where: {
          email
        }
      })
      if (!theUser) throw new Error('Unable to Login');
      const isMatch = bcrypt.compareSync(password, theUser.password);
      if (!isMatch) throw new Error('Unable to Login');
      return {token : jwt.sign(theUser, "supersecret")};
    }
  }
};

module.exports = resolvers;