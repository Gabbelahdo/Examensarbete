const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/register', async(req, res) => {
const {username, password} = req.body;
if (!username || !password) return res.status(400).json({ message: 'Saknar användarnamn eller lösenord' });

const existing = await prisma.user.findUnique({ where: { username } });

if(existing){
    return res.status(400).json({message: 'Användarnamn redan taget'});
}

const hashedLosenord = await bcrypt.hash(password, 10);
const user = await prisma.user.create({
    data: {username, password: hashedLosenord}
});

res.json({message: 'Användare skapad!', user: {id: user.id, username: user.username}});

});


router.post('/login', async(req, res) => {
const { username, password } = req.body;
const user = await prisma.user.findUnique({where: { username }});
if(!user) return res.status(401).json({message: 'Fel användarnamn eller lösenord'})

const valid = await bcrypt.compare(password, user.password);
if(!valid) return res.status(401).json({message: 'Fel användarnamn eller lösenord'});

const token = jwt.sign({userId: user.id,username: user.username }, SECRET, {expiresIn: '1h'});
res.json({token});
});


module.exports = router;
