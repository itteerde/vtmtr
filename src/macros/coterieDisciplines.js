let cd = new Map();
game.folders.getName("The Coterie").contents.filter(e=>e.type==='vampire').forEach(v=>{
    disciplines = Object.getOwnPropertyNames(v.system.disciplines);
    disciplines.forEach(d=>{
        if(!cd.get(d)){
            cd.set(d,[]);
        }
        cd.get(d).join(d.powers.map(p=>p.name));
    });
});
console.log(cd);