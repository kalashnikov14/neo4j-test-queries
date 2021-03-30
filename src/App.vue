<template>
  <div id="app">
    <div>
      <!--  <button @click="connect()">Connect</button>-->
      <button @click="testQuery()">Connect</button>
      <br>
      <br>
      <br>
      <button @click="log()">log</button>
      <br>
    </div>
    <div v-for="(n, idx) in output"
         :key="idx">
      <br>
      title: {{n.title}}
      <br>
      seller: {{n.sellerName}}
    </div>
  </div>

</template>

<script>

export default {
  name: 'App',
  data(){
    return{
      image: null,
      output: [],
      protocol: 'bolt',
      host: 'localhost',
      port: 7687,
      username: 'neo4j',
      password: 'admin',
      text: 'Petro',
      propObject: {
        title: 'fourth add',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic nisi possimus ratione sint?',
        top: true,
        src: [
          {imageURL: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'},
          {imageURL: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'},
        ],
        show: false,
        liked: false,
        sellerName: 'Vasil',
        phone: '434343453',
        cost: 23345345,
        city:'Kyiv',
        residentialComplex: 'test',
        constructionType: 'Type II',
        heatingType: 'Steam Radiant Heat Systems',
        condition: 'for renovation',
        warmingType: 'mineral wool',
        layoutType: '3-room',
        closedArea: true,
        parking: false,
        ceilingH: 43.435,
        storeyNum: 324,
        costForM2: 234,
        areaM2: 324,
        wallsType: 'Masonry Wall',
        classItem: 'usual',
        id: this.getRand(4,3243),
      },
    }
  },

  mounted() {
    this.$neo4j.connect(this.protocol, this.host, this.port, this.username, this.password)
    const session = this.$neo4j.getSession()

    const vm = this
    //"match(a:Property)-[r]-(t) return collect(t.name)"
    session.run("match(n:Property)-[k]-(s) return distinct(n), collect(s.name) as scores, collect(k.name) as rel")
        .then(function (result){
          let outArr = []
          let propArr = {}
          console.log(result)
          for (let i = 0; i < result.records.length; i++){
            let arr1 = result.records[i]._fields[1]
            let arr2 = result.records[i]._fields[2]
            for (let k = 0; k < result.records[i]._fields[2].length; k++){
              propArr[arr2[k]] = arr1[k]
            }
            console.log(propArr)
            Object.assign(result.records[i]._fields[0].properties, propArr)
            outArr.push(result.records[i]._fields[0].properties)
          }
          console.log(outArr)
          vm.$store.dispatch('addData', outArr)
          vm.output = vm.$store.getters['getDbLog']
          console.log(vm.$store.getters['getDbLog'])
        })
        .catch(function (err){
          console.log(err)
        })

  },

  methods: {

    getRand (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    },
    async testQuery() {
      const vm = this
      // Get a session from the driver
      let obj = this.propObject
      const session = this.$neo4j.getSession()
      // Or you can just call this.$neo4j.run(cypher, params)
      await session.run(
          "MATCH (b: City {name: $data.city})" +
          "MATCH (c: WarmingType {name: $data.warmingType})" +
          "MATCH (d: HeatingType {name: $data.heatingType})" +
          "MATCH (e: ConstructionType {name: $data.constructionType})" +
          "MATCH (f: Condition {name: $data.condition})" +
          "MATCH (g: LayoutType {name: $data.layoutType})" +
          "MATCH (h: WallsType {name: $data.wallsType})" +
          "MATCH (k: Class {name: $data.classItem})" +
          "CREATE (a:Property {title:$data.title," +
          "description:$data.description," +
          "cost:$data.cost," +
          "id:$data.id," +
          "residentialComplex: $data.residentialComplex," +
          "ceilingH: $data.ceilingH," +
          "closedArea:$data.closedArea," +
          "parking:$data.parking," +
          "storeyNum:$data.storeyNum," +
          "show:$data.show," +
          "liked:$data.liked," +
          "top:$data.top," +
          "id:$data.id," +
          "sellerName:$data.sellerName," +
          "phone:$data.phone," +
          "areaM2:$data.areaM2" +
          "})-[:IN_CITY {name: 'city'}]->(b)," +
          "(a)-[:WARMING_TYPE {name: 'warmingType'}]->(c)," +
          "(a)-[:HEATING_TYPE {name: 'heatingType'}]->(d)," +
          "(a)-[:CONSTRUCTION_TYPE {name: 'constructionType'}]->(e)," +
          "(a)-[:CONDITION {name: 'condition'}]->(f)," +
          "(a)-[:LAYOUT {name: 'layoutType'}]->(g)," +
          "(a)-[:CLASS_TYPE {name: 'classItem'}]->(k)," +
          "(a)-[:WALLS_TYPE {name: 'wallsType'}]->(h)",
          {
            data : obj
          }
      )
          .then( ()=>
          {
            return session.run("match(n:Property) return n")
          })
          .then(function (result){
            let outArr = []
            console.log(result)
            console.log(result.records[0]._fields[0].identity.low)
            for (let i = 0; i < result.records.length; i++){
              outArr.push(result.records[i]._fields[0].properties)
            }
            vm.$store.dispatch('addData', outArr)
            vm.output = vm.$store.getters['getDbLog']
          })
          .catch(function (err){
            console.log(err)
          })
    },
    // async results(){
    //   const session = this.$neo4j.getSession()
    //   let receiver = null
    //   await session.run("match(n:Property) return n")
    //   .then(function (result){
    //     let outArr = []
    //     console.log(result.records[0]._fields[0].identity.low)
    //     for (let i = 0; i < result.records.length; i++){
    //     outArr.push(result.records[i]._fields[0].properties)
    //     console.log(outArr)
    //     }
    //     receiver = outArr
    //   })
    //   .catch(function (err){
    //     console.log(err)
    //   })
    //
    //    this.output = receiver
    //   console.log(this.output)
    // },
    log(){
      console.log(this.$store.getters['getDbLog'])
    },
  }
}
</script>
<style scoped>
</style>
