import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let usuarios = []; // Almacenamiento en memoria (por ahora)

export const register = (req, res) => {
    const { email, password } = req.body;

    if (usuarios.find(u => u.email === email)) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { email, password: hashedPassword };
    usuarios.push(newUser);

    res.status(201).json({ message: "Usuario registrado" });
};

export const login = (req, res) => {
    const { email, password } = req.body;
    const user = usuarios.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
