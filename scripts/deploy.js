const BEAN_ADDRESS = '0xDC59ac4FeFa32293A95889Dc396682858d52e5Db'

async function main() {
  const BudgetFactory = await ethers.getContractFactory("Budget");
  const DevelopmentBudget = await upgrades.deployProxy(BudgetFactory, [BEAN_ADDRESS]);
  await DevelopmentBudget.deployed();
  console.log("Development Budget deployed to:", DevelopmentBudget.address);

  const MarketingBudget = await upgrades.deployProxy(BudgetFactory, [BEAN_ADDRESS]);
  await MarketingBudget.deployed();
  console.log("Marketing Budget deployed to:", MarketingBudget.address);
}

if (require.main === module) {
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
  }
  exports.deploy = main