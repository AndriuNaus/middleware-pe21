import express, {type Request, type Response} from "express";

const app = express()

app.use(express.json())
//const no se pede reasingnar un valor constante
// let se puede setear el valor 
// var es para declarar globales 

const PORT = 3000

app.get('/health', (req: Request, res: Response) => {
  res.json(
    {
        code:200,
        status:"ok",
        date:new Date().toISOString()

})
})

app.listen(PORT, () =>{
    console.log("Servidor inciado")
})