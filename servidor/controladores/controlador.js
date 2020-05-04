const con = require('../lib/conexionbd.js');

var anio = "anio";
var titulo = "titulo";
var genero = "genero_id"


function buscarPeliculas(req,res){
    var sql = "SELECT * FROM pelicula WHERE id=id"
    var sql1 = "SELECT count(*) as total FROM pelicula WHERE id=id"
    var respuesta = {
      'peliculas' : "",
      'total': cantidad
    }
    var orden = req.query.columna_orden;
    var tipo = req.query.tipo_orden;
    var cantidad = req.query.cantidad;
    var pagina = (req.query.pagina - 1) * cantidad

    if(req.query.anio){
      anio = req.query.anio;
      sql = sql + " and anio =" +anio;
      sql1 = sql1 + " and anio =" +anio;
    }
    if(req.query.titulo){
      titulo = req.query.titulo;
      sql = sql + ' and titulo like "%'+titulo+'%"';
      sql1 = sql1 + ' and titulo like "%'+titulo+'%"';
    }
    if(req.query.genero){
      genero = req.query.genero;
      sql = sql + " and genero_id =" + genero;
      sql1 = sql1 + " and genero_id =" + genero;
    }

    sql = sql + " order by " + orden + " " + tipo + " limit " + pagina + "," + cantidad;

        con.query(sql, function (err, resultado,fields) {
          if (err){
            console.log("Hubo un error en la obtencion de peliculas");
            return res.status(404).send("Hubo un error en la obtencion de peliculas");
          }
            respuesta.peliculas = resultado;
              con.query(sql1, function (err, resultado1,fields) {
                if (err){
                  console.log("Hubo un error en la paginacion de peliculas");
                  return res.status(404).send("Hubo un error en la paginacion de peliculas");
                }
                respuesta.total = resultado1[0].total;

                res.json(respuesta);
          });

  });
};
function buscarGenero(req,res){

  var sql = "SELECT * FROM genero";
  con.query(sql,function(err,resultado,fields){
      if(err){
          console.log("Hubo un error en la obtencion de generos");
          return res.status(404).send("Hubo un error en la obtencion de generos " + err);
      }
      var respuesta = {
          generos : resultado
      };
      res.json(respuesta)
  }
  )}

function obtenerPelicula(req,res){
  var id = req.params.id;
  var sqlInfoPelicula = "SELECT * FROM pelicula WHERE id =" + id;
  var sqlInfoActores = "SELECT actor.nombre FROM actor_pelicula INNER JOIN actor ON actor_pelicula.actor_id = actor.id WHERE actor_pelicula.pelicula_id =" + id;
  var sqlInfoGenero = "SELECT nombre FROM genero INNER JOIN pelicula ON pelicula.genero_id = genero.id WHERE pelicula.id  = " + id;

  con.query(sqlInfoPelicula,function (err, resultado,fields) {
    if (err){
      console.log("Hubo un error en la obtencion de la informacion de la pelicula");
      return res.status(404).send("Hubo un error en la obtencion de la informacion de la pelicula");
    }
    const pelicula = resultado[0]
    con.query( sqlInfoGenero,function (err, resultado1,fields) {
      if (err){
        console.log("Hubo un error en la obtencion del genero de pelicula");
        return res.status(404).send("Hubo un error en la obtencion del genero de pelicula");
      }
      const genero = resultado1[0];
      con.query(sqlInfoActores,function (err, resultado2,fields) {
        if (err){
          console.log("Hubo un error en la obtencion de actores de la pelicula");
          return res.status(404).send("Hubo un error en la obtencion de actores de la pelicula");
        }
      const actores = resultado2;
        var retorno = {
          'pelicula' : pelicula,
          'genero' : genero,
          'actores' : actores
         }
        res.json(retorno)
      });
    });
  });
}

 function buscarRecomendacion(req,res){
  var sqlRecomendacion = "select * from pelicula inner join genero on pelicula.genero_id = genero.id where pelicula.id = pelicula.id";
  if (req.query.genero) {
    var genero = req.query.genero;
    sqlRecomendacion = sqlRecomendacion +  " and genero.nombre =" +"'"+genero+"'";
    }
    if (req.query.anio_inicio){
      var anioInicio = req.query.anio_inicio;
      sqlRecomendacion= sqlRecomendacion +  " and pelicula.anio between " +anioInicio;
    }
    if (req.query.anio_fin){
      var anioFin = req.query.anio_fin;
      sqlRecomendacion = sqlRecomendacion +  " and " +anioFin;
    }
    if (req.query.puntuacion){
      var puntuacion = req.query.puntuacion;
      sqlRecomendacion = sqlRecomendacion +  " and puntuacion >=" +puntuacion;    
    }
    var respuesta = {
      'peliculas': "",
        }
        con.query(sqlRecomendacion, function(err, resultado, fields){
          if (err){
            console.log("Hubo un error en la obtencion de la recomendacion de pelicula");
            return res.status(404).send("Hubo un error en la obtencion de la recomendacion de pelicula");
          }         
          respuesta.peliculas = resultado;
          res.json(respuesta);
      })
 }
module.exports = {
    buscarPeliculas : buscarPeliculas,
    buscarGenero : buscarGenero,
    obtenerPelicula : obtenerPelicula,
    buscarRecomendacion : buscarRecomendacion
};