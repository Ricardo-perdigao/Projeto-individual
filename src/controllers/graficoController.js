var graficoModel = ("../Models/graficoModel")

function grafico(req, res){
    var idusuario = req.body.idusuario;
    graficoModel.grafico(idusuario)
    
    .then(resposta => {res.status(200).json(resposta)})
    .catch(erro => {console.error(erro); res.status(500).json(erro)})
}

module.exports = {
grafico
};