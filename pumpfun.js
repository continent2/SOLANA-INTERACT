"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpFunSDK = exports.DEFAULT_DECIMALS = exports.METADATA_SEED = exports.BONDING_CURVE_SEED = exports.MINT_AUTHORITY_SEED = exports.GLOBAL_ACCOUNT_SEED = void 0;
var web3_js_1 = require("@solana/web3.js");
var anchor_1 = require("@coral-xyz/anchor");
var globalAccount_1 = require("./globalAccount");
var events_1 = require("./events");
var spl_token_1 = require("@solana/spl-token");
var bondingCurveAccount_1 = require("./bondingCurveAccount");
var bn_js_1 = require("bn.js");
var util_1 = require("./util");
var IDL_1 = require("./IDL");
var PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
var MPL_TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
exports.GLOBAL_ACCOUNT_SEED = "global";
exports.MINT_AUTHORITY_SEED = "mint-authority";
exports.BONDING_CURVE_SEED = "bonding-curve";
exports.METADATA_SEED = "metadata";
exports.DEFAULT_DECIMALS = 6;
var PumpFunSDK = /** @class */ (function () {
    function PumpFunSDK(provider) {
        this.program = new anchor_1.Program(IDL_1.IDL, provider);
        this.connection = this.program.provider.connection;
    }
    PumpFunSDK.prototype.createAndBuy = function (creator_1, mint_1, createTokenMetadata_1, buyAmountSol_1) {
        return __awaiter(this, arguments, void 0, function (creator, mint, createTokenMetadata, buyAmountSol, slippageBasisPoints, priorityFees, commitment, finality) {
            var tokenMetadata, createTx, newTx, globalAccount, buyAmount, buyAmountWithSlippage, buyTx, createResults;
            if (slippageBasisPoints === void 0) { slippageBasisPoints = 500n; }
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            if (finality === void 0) { finality = util_1.DEFAULT_FINALITY; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createTokenMetadata(createTokenMetadata)];
                    case 1:
                        tokenMetadata = _a.sent();
                        return [4 /*yield*/, this.getCreateInstructions(creator.publicKey, createTokenMetadata.name, createTokenMetadata.symbol, tokenMetadata.metadataUri, mint)];
                    case 2:
                        createTx = _a.sent();
                        newTx = new web3_js_1.Transaction().add(createTx);
                        if (!(buyAmountSol > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getGlobalAccount(commitment)];
                    case 3:
                        globalAccount = _a.sent();
                        buyAmount = globalAccount.getInitialBuyPrice(buyAmountSol);
                        buyAmountWithSlippage = (0, util_1.calculateWithSlippageBuy)(buyAmountSol, slippageBasisPoints);
                        return [4 /*yield*/, this.getBuyInstructions(creator.publicKey, mint.publicKey, globalAccount.feeRecipient, buyAmount, buyAmountWithSlippage)];
                    case 4:
                        buyTx = _a.sent();
                        newTx.add(buyTx);
                        _a.label = 5;
                    case 5: return [4 /*yield*/, (0, util_1.sendTx)(this.connection, newTx, creator.publicKey, [creator, mint], priorityFees, commitment, finality)];
                    case 6:
                        createResults = _a.sent();
                        return [2 /*return*/, createResults];
                }
            });
        });
    };
    PumpFunSDK.prototype.buy = function (buyer_1, mint_1, buyAmountSol_1) {
        return __awaiter(this, arguments, void 0, function (buyer, mint, buyAmountSol, slippageBasisPoints, priorityFees, commitment, finality) {
            var buyTx, buyResults;
            if (slippageBasisPoints === void 0) { slippageBasisPoints = 500n; }
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            if (finality === void 0) { finality = util_1.DEFAULT_FINALITY; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBuyInstructionsBySolAmount(buyer.publicKey, mint, buyAmountSol, slippageBasisPoints, commitment)];
                    case 1:
                        buyTx = _a.sent();
                        return [4 /*yield*/, (0, util_1.sendTx)(this.connection, buyTx, buyer.publicKey, [buyer], priorityFees, commitment, finality)];
                    case 2:
                        buyResults = _a.sent();
                        return [2 /*return*/, buyResults];
                }
            });
        });
    };
    PumpFunSDK.prototype.sell = function (seller_1, mint_1, sellTokenAmount_1) {
        return __awaiter(this, arguments, void 0, function (seller, mint, sellTokenAmount, slippageBasisPoints, priorityFees, commitment, finality) {
            var sellTx, sellResults;
            if (slippageBasisPoints === void 0) { slippageBasisPoints = 500n; }
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            if (finality === void 0) { finality = util_1.DEFAULT_FINALITY; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSellInstructionsByTokenAmount(seller.publicKey, mint, sellTokenAmount, slippageBasisPoints, commitment)];
                    case 1:
                        sellTx = _a.sent();
                        return [4 /*yield*/, (0, util_1.sendTx)(this.connection, sellTx, seller.publicKey, [seller], priorityFees, commitment, finality)];
                    case 2:
                        sellResults = _a.sent();
                        return [2 /*return*/, sellResults];
                }
            });
        });
    };
    //create token instructions
    PumpFunSDK.prototype.getCreateInstructions = function (creator, name, symbol, uri, mint) {
        return __awaiter(this, void 0, void 0, function () {
            var mplTokenMetadata, metadataPDA, associatedBondingCurve;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mplTokenMetadata = new web3_js_1.PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);
                        metadataPDA = web3_js_1.PublicKey.findProgramAddressSync([
                            Buffer.from(exports.METADATA_SEED),
                            mplTokenMetadata.toBuffer(),
                            mint.publicKey.toBuffer(),
                        ], mplTokenMetadata)[0];
                        return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint.publicKey, this.getBondingCurvePDA(mint.publicKey), true)];
                    case 1:
                        associatedBondingCurve = _a.sent();
                        return [2 /*return*/, this.program.methods
                                .create(name, symbol, uri)
                                .accounts({
                                mint: mint.publicKey,
                                associatedBondingCurve: associatedBondingCurve,
                                metadata: metadataPDA,
                                user: creator,
                            })
                                .signers([mint])
                                .transaction()];
                }
            });
        });
    };
    PumpFunSDK.prototype.getBuyInstructionsBySolAmount = function (buyer_1, mint_1, buyAmountSol_1) {
        return __awaiter(this, arguments, void 0, function (buyer, mint, buyAmountSol, slippageBasisPoints, commitment) {
            var bondingCurveAccount, buyAmount, buyAmountWithSlippage, globalAccount;
            if (slippageBasisPoints === void 0) { slippageBasisPoints = 500n; }
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBondingCurveAccount(mint, commitment)];
                    case 1:
                        bondingCurveAccount = _a.sent();
                        if (!bondingCurveAccount) {
                            throw new Error("Bonding curve account not found: ".concat(mint.toBase58()));
                        }
                        buyAmount = bondingCurveAccount.getBuyPrice(buyAmountSol);
                        buyAmountWithSlippage = (0, util_1.calculateWithSlippageBuy)(buyAmountSol, slippageBasisPoints);
                        return [4 /*yield*/, this.getGlobalAccount(commitment)];
                    case 2:
                        globalAccount = _a.sent();
                        return [4 /*yield*/, this.getBuyInstructions(buyer, mint, globalAccount.feeRecipient, buyAmount, buyAmountWithSlippage)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //buy
    PumpFunSDK.prototype.getBuyInstructions = function (buyer_1, mint_1, feeRecipient_1, amount_1, solAmount_1) {
        return __awaiter(this, arguments, void 0, function (buyer, mint, feeRecipient, amount, solAmount, commitment) {
            var associatedBondingCurve, associatedUser, transaction, e_1, _a, _b;
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, this.getBondingCurvePDA(mint), true)];
                    case 1:
                        associatedBondingCurve = _c.sent();
                        return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, buyer, false)];
                    case 2:
                        associatedUser = _c.sent();
                        transaction = new web3_js_1.Transaction();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, (0, spl_token_1.getAccount)(this.connection, associatedUser, commitment)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _c.sent();
                        transaction.add((0, spl_token_1.createAssociatedTokenAccountInstruction)(buyer, associatedUser, buyer, mint));
                        return [3 /*break*/, 6];
                    case 6:
                        _b = (_a = transaction).add;
                        return [4 /*yield*/, this.program.methods
                                .buy(new bn_js_1.BN(amount.toString()), new bn_js_1.BN(solAmount.toString()))
                                .accounts({
                                feeRecipient: feeRecipient,
                                mint: mint,
                                associatedBondingCurve: associatedBondingCurve,
                                associatedUser: associatedUser,
                                user: buyer,
                            })
                                .transaction()];
                    case 7:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, transaction];
                }
            });
        });
    };
    //sell
    PumpFunSDK.prototype.getSellInstructionsByTokenAmount = function (seller_1, mint_1, sellTokenAmount_1) {
        return __awaiter(this, arguments, void 0, function (seller, mint, sellTokenAmount, slippageBasisPoints, commitment) {
            var bondingCurveAccount, globalAccount, minSolOutput, sellAmountWithSlippage;
            if (slippageBasisPoints === void 0) { slippageBasisPoints = 500n; }
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBondingCurveAccount(mint, commitment)];
                    case 1:
                        bondingCurveAccount = _a.sent();
                        if (!bondingCurveAccount) {
                            throw new Error("Bonding curve account not found: ".concat(mint.toBase58()));
                        }
                        return [4 /*yield*/, this.getGlobalAccount(commitment)];
                    case 2:
                        globalAccount = _a.sent();
                        minSolOutput = bondingCurveAccount.getSellPrice(sellTokenAmount, globalAccount.feeBasisPoints);
                        sellAmountWithSlippage = (0, util_1.calculateWithSlippageSell)(minSolOutput, slippageBasisPoints);
                        return [4 /*yield*/, this.getSellInstructions(seller, mint, globalAccount.feeRecipient, sellTokenAmount, sellAmountWithSlippage)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PumpFunSDK.prototype.getSellInstructions = function (seller, mint, feeRecipient, amount, minSolOutput) {
        return __awaiter(this, void 0, void 0, function () {
            var associatedBondingCurve, associatedUser, transaction, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, this.getBondingCurvePDA(mint), true)];
                    case 1:
                        associatedBondingCurve = _c.sent();
                        return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mint, seller, false)];
                    case 2:
                        associatedUser = _c.sent();
                        transaction = new web3_js_1.Transaction();
                        _b = (_a = transaction).add;
                        return [4 /*yield*/, this.program.methods
                                .sell(new bn_js_1.BN(amount.toString()), new bn_js_1.BN(minSolOutput.toString()))
                                .accounts({
                                feeRecipient: feeRecipient,
                                mint: mint,
                                associatedBondingCurve: associatedBondingCurve,
                                associatedUser: associatedUser,
                                user: seller,
                            })
                                .transaction()];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/, transaction];
                }
            });
        });
    };
    PumpFunSDK.prototype.getBondingCurveAccount = function (mint_1) {
        return __awaiter(this, arguments, void 0, function (mint, commitment) {
            var tokenAccount;
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.getAccountInfo(this.getBondingCurvePDA(mint), commitment)];
                    case 1:
                        tokenAccount = _a.sent();
                        if (!tokenAccount) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, bondingCurveAccount_1.BondingCurveAccount.fromBuffer(tokenAccount.data)];
                }
            });
        });
    };
    PumpFunSDK.prototype.getGlobalAccount = function () {
        return __awaiter(this, arguments, void 0, function (commitment) {
            var globalAccountPDA, tokenAccount;
            if (commitment === void 0) { commitment = util_1.DEFAULT_COMMITMENT; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        globalAccountPDA = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(exports.GLOBAL_ACCOUNT_SEED)], new web3_js_1.PublicKey(PROGRAM_ID))[0];
                        return [4 /*yield*/, this.connection.getAccountInfo(globalAccountPDA, commitment)];
                    case 1:
                        tokenAccount = _a.sent();
                        return [2 /*return*/, globalAccount_1.GlobalAccount.fromBuffer(tokenAccount.data)];
                }
            });
        });
    };
    PumpFunSDK.prototype.getBondingCurvePDA = function (mint) {
        return web3_js_1.PublicKey.findProgramAddressSync([Buffer.from(exports.BONDING_CURVE_SEED), mint.toBuffer()], this.program.programId)[0];
    };
    PumpFunSDK.prototype.createTokenMetadata = function (create) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, request, errorText, responseText, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate file
                        if (!(create.file instanceof Blob)) {
                            throw new Error('File must be a Blob or File object');
                        }
                        formData = new FormData();
                        formData.append("file", create.file, 'image.png'); // Add filename
                        formData.append("name", create.name);
                        formData.append("symbol", create.symbol);
                        formData.append("description", create.description);
                        formData.append("twitter", create.twitter || "");
                        formData.append("telegram", create.telegram || "");
                        formData.append("website", create.website || "");
                        formData.append("showName", "true");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fetch("https://pump.fun/api/ipfs", {
                                method: "POST",
                                headers: {
                                    'Accept': 'application/json',
                                },
                                body: formData,
                                credentials: 'same-origin'
                            })];
                    case 2:
                        request = _a.sent();
                        if (!(request.status === 500)) return [3 /*break*/, 4];
                        return [4 /*yield*/, request.text()];
                    case 3:
                        errorText = _a.sent();
                        throw new Error("Server error (500): ".concat(errorText || 'No error details available'));
                    case 4:
                        if (!request.ok) {
                            throw new Error("HTTP error! status: ".concat(request.status));
                        }
                        return [4 /*yield*/, request.text()];
                    case 5:
                        responseText = _a.sent();
                        if (!responseText) {
                            throw new Error('Empty response received from server');
                        }
                        try {
                            return [2 /*return*/, JSON.parse(responseText)];
                        }
                        catch (e) {
                            throw new Error("Invalid JSON response: ".concat(responseText));
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error in createTokenMetadata:', error_1);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //EVENTS
    PumpFunSDK.prototype.addEventListener = function (eventType, callback) {
        return this.program.addEventListener(eventType, function (event, slot, signature) {
            var processedEvent;
            switch (eventType) {
                case "createEvent":
                    processedEvent = (0, events_1.toCreateEvent)(event);
                    callback(processedEvent, slot, signature);
                    break;
                case "tradeEvent":
                    processedEvent = (0, events_1.toTradeEvent)(event);
                    callback(processedEvent, slot, signature);
                    break;
                case "completeEvent":
                    processedEvent = (0, events_1.toCompleteEvent)(event);
                    callback(processedEvent, slot, signature);
                    console.log("completeEvent", event, slot, signature);
                    break;
                case "setParamsEvent":
                    processedEvent = (0, events_1.toSetParamsEvent)(event);
                    callback(processedEvent, slot, signature);
                    break;
                default:
                    console.error("Unhandled event type:", eventType);
            }
        });
    };
    PumpFunSDK.prototype.removeEventListener = function (eventId) {
        this.program.removeEventListener(eventId);
    };
    return PumpFunSDK;
}());
exports.PumpFunSDK = PumpFunSDK;
