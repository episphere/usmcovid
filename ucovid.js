console.log('ucovid.js loaded')

ucovid={
    date:new Date()
}


ucovid.genomes=async (url)=>{ // list with results will be stored at ucovid.genomes.list
    // default url, note cache in localforage
    url=url||"https://api.ncbi.nlm.nih.gov/datasets/v1alpha/virus/taxon/2697049/genome/table?refseq_only=false&annotated_only=true&host=9606&complete_only=true&table_fields=nucleotide_accession&table_fields=species_tax_id&table_fields=species_name&table_fields=genus&table_fields=family&table_fields=isolate_name&table_fields=nucleotide_length&table_fields=sequence_type&table_fields=nuc_completeness&table_fields=geo_location&table_fields=us_state&table_fields=host_name&table_fields=host_tax_id&table_fields=collection_date&table_fields=bioproject&table_fields=biosample&format=jsonl";
    if(!ucovid.genomes.list){
        if(typeof(localforage)!='undefined'){ // if localforage exists
            ucovid.genomes.list= await localforage.getItem('ucovid.genomes.list')
        }
        if(!ucovid.genomes.list){
            let txt = await(await fetch(url)).text()
            ucovid.genomes.list = JSON.parse(`[${txt.replace(/[\n\r]+/g,',').slice(0,-1)}]`)
            if(typeof(localforage)!='undefined'){ // if localforage exists
                localforage.setItem('ucovid.genomes.list',ucovid.genomes.list)
            }
        }   
    }
    return ucovid.genomes.list
}

ucovid.getSequence= async (acc='LC528232.1')=>{ // get fasta for genome by accession id
    //let txt = await(await fetch(`https://www.ncbi.nlm.nih.gov/search/api/download-sequence/?db=nuccore&id=${acc}`)).txt()
    // https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=1968818726&report=fasta
    let txt = await (await fetch(`https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=${acc}&db=nuccore&report=fasta`)).text()
    return txt
}

ucovid.getLocalForage=()=>{
    if(typeof(localforage)=='undefined'){
        let s = document.createElement('script')
        s.src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"
        document.head.appendChild(s)
    }
}

if(typeof(define)!='undefined'){
    define(ucovid);
}

try {
    ucovid.getLocalForage()
}catch(err){
    console.log('local forage not available')
}