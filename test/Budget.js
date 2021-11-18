const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("Budget", async function () {
    
    let Token;
    let Budget;
    let owner;
    let nonowner;
    let result;
    let field;
    let UpBudget;

    beforeEach(async function () {
        [owner, nonowner] = await ethers.getSigners();

        const MockToken = await ethers.getContractFactory("MockToken");
        Token = await MockToken.deploy();

        const FieldFacet = await ethers.getContractFactory("FieldFacet");
        field = await FieldFacet.deploy(Token.address);

    });

    describe("Deploy", async function () {

        beforeEach(async function () {
            [owner, nonowner] = await ethers.getSigners();

            const MockToken = await ethers.getContractFactory("MockToken");
            Token = await MockToken.deploy();

            const FieldFacet = await ethers.getContractFactory("FieldFacet");
            field = await FieldFacet.deploy(Token.address);

            const BudgetFactory = await ethers.getContractFactory("Budget");
            Budget = await upgrades.deployProxy(BudgetFactory, [Token.address, field.address])

            Token.mint(Budget.address, 100)
        });

        it("Properly shows the balance", async function () {
            expect(await Budget.balance()).to.equal(100);
        });

        it("Reverts when non-owners try to pay from the budget", async function () {
            await expect(Budget.connect(nonowner).pay(nonowner.address, 1)).to.be.revertedWith('Ownable: caller is not the owner');
        });

        describe("When owner pays from the budget", async function () {
            beforeEach(async function () {
                result = await Budget.pay(owner.address,1)
            });

            it("Decreases the budget", async function () {
                expect(await Budget.balance()).to.equal(99);
            });

            it("Increases the balance of the payee address", async function () {
                expect(await Token.balanceOf(owner.address)).to.equal(1);
            });

            it("Events a Payment Event", async function () {
                await expect(result)
                .to.emit(Budget, 'Payment')
                .withArgs(owner.address, 1);
            });
        });
        
        describe("When owner sows a plot", async function () {
            beforeEach(async function () {
                this.result = await Budget.sow('10');
            });

            it("owns a plot", async function () {
                expect(await field.plot(Budget.address, '0')).to.equal('10');
            })
        });

        describe("When owner transfers a plot", async function () {
            beforeEach(async function () {
                this.result = await Budget.sow('10');
                this.result = await Budget.payPlot(nonowner.address, '0', '0', '10');
            });

            it("user owns a plot", async function () {
                expect(await field.plot(nonowner.address, '0')).to.equal('10');
            })

            it("Budget does not own a plot", async function () {
                expect(await field.plot(Budget.address, '0')).to.equal('0');
            })
        });
    });

    describe("Upgrade", async function () {

        beforeEach(async function () {
            const BudgetOldFactory = await ethers.getContractFactory("BudgetOld");
            OldBudget = await upgrades.deployProxy(BudgetOldFactory, [Token.address])
            Token.mint(OldBudget.address, 100)

            const BudgetFactory = await ethers.getContractFactory("Budget");
            UpBudget = await upgrades.upgradeProxy(OldBudget.address, BudgetFactory);
            await (await UpBudget.setBeanstalk(field.address)).wait()
        })

        describe("When owner pays from the budget", async function () {
            beforeEach(async function () {
                result = await UpBudget.pay(owner.address,1)
            });

            it("Decreases the budget", async function () {
                expect(await UpBudget.balance()).to.equal(99);
            });

            it("Increases the balance of the payee address", async function () {
                expect(await Token.balanceOf(owner.address)).to.equal(1);
            });

            it("Events a Payment Event", async function () {
                await expect(result)
                .to.emit(UpBudget, 'Payment')
                .withArgs(owner.address, 1);
            });
        });
    
    describe("When owner sows a plot", async function () {
        beforeEach(async function () {
            this.result = await UpBudget.sow('10');
        });

        it("owns a plot", async function () {
            expect(await field.plot(UpBudget.address, '0')).to.equal('10');
        })
    });

    describe("When owner transfers a plot", async function () {
        beforeEach(async function () {
            this.result = await UpBudget.sow('10');
            this.result = await UpBudget.payPlot(nonowner.address, '0', '0', '10');
        });

        it("user owns a plot", async function () {
            expect(await field.plot(nonowner.address, '0')).to.equal('10');
        })

        it("Budget does not own a plot", async function () {
            expect(await field.plot(UpBudget.address, '0')).to.equal('0');
        })
    });
    });
});
