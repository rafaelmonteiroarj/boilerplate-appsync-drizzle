const { execSync } = require("child_process");

// verifica se o parâmetro foi passado
const stage = process.argv[2];

if (!stage) {
  console.error(
    "Erro: o parâmetro stage é obrigatório. Como usar: npm run deploy <stage(pet | prd)>"
  );

  process.exit(1);
}

// executa o comando de deploy com o stage informado
try {
  execSync(`sls deploy --stage ${stage}`, { stdio: "inherit" });
} catch (err) {
  console.error("Deployment failed:", err);
  process.exit(1);
}
