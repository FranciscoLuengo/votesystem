"use client";
import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet, Plus, Trash2, Vote, XCircle } from "lucide-react";
import { contractABI, contractAddress } from "./datos";

export default function App() {
    const [address, setAddress] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [newProposal, setNewProposal] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [notification, setNotification] = useState("");

    const connectWallet = async () => {
        setLoading(true);
        setErrorMessage("");
        setNotification("");

        try {
            if (typeof window.ethereum !== "undefined") {
                const provider = new BrowserProvider(window.ethereum);
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                setAddress(userAddress);

                const contract = new Contract(
                    contractAddress,
                    contractABI,
                    signer
                );
                await fetchProposals(contract);

                const chairPerson = await contract.getChairPerson();
                setIsAdmin(
                    userAddress.toLowerCase() === chairPerson.toLowerCase()
                );

                setNotification("Conectado con éxito");
            } else {
                setErrorMessage("MetaMask no está instalado");
            }
        } catch (error) {
            console.error("Error al conectar MetaMask:", error);
            setErrorMessage("Error al conectar MetaMask");
        } finally {
            setLoading(false);
        }
    };

    const fetchProposals = async (contract) => {
        try {
            const proposalsList = await contract.getProposals();
            setProposals(proposalsList);
        } catch (error) {
            console.error("Error al obtener las propuestas:", error);
            setErrorMessage("Error al obtener las propuestas");
        }
    };

    const addProposal = async () => {
        setLoading(true);
        setNotification("");
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const tx = await contract.addProposal(newProposal);
            await tx.wait();
            setNewProposal("");
            await fetchProposals(contract);
            setErrorMessage("");
            setNotification("Propuesta agregada con éxito.");
        } catch (error) {
            console.error("Error al agregar propuesta:", error);
            setErrorMessage("Error al agregar propuesta.");
            setNotification("");
        } finally {
            setLoading(false);
        }
    };

    const removeProposal = async (name) => {
        setLoading(true);
        setNotification("");
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const tx = await contract.removeProposalByName(name);
            await tx.wait();
            await fetchProposals(contract);
            setErrorMessage("");
            setNotification("Propuesta eliminada con éxito.");
        } catch (error) {
            console.error("Error al eliminar propuesta:", error);
            setErrorMessage("Error al eliminar propuesta.");
            setNotification("");
        } finally {
            setLoading(false);
        }
    };

    const vote = async (index) => {
        setLoading(true);
        setNotification("");
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const tx = await contract.vote(index);
            await tx.wait();
            await fetchProposals(contract);
            setErrorMessage("");
            setNotification("Voto emitido con éxito.");
        } catch (error) {
            console.error("Error al votar:", error);
            setErrorMessage(
                "Error al votar. Ya has votado / Error en la transacción"
            );
            setNotification("");
        } finally {
            setLoading(false);
        }
    };

    const removeVote = async () => {
        setLoading(true);
        setNotification("");
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const tx = await contract.removeVote();
            await tx.wait();
            await fetchProposals(contract);
            setErrorMessage("");
            setNotification("Voto eliminado con éxito.");
        } catch (error) {
            console.error("Error al eliminar voto:", error);
            setErrorMessage("Error al eliminar voto.");
            setNotification("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6 font-sans">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-primary">
                        Sistema de votaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!address ? (
                        <div className="flex justify-center">
                            <Button
                                onClick={connectWallet}
                                disabled={loading}
                                size="lg"
                                className="mt-4"
                            >
                                {loading ? (
                                    "Conectando..."
                                ) : (
                                    <>
                                        <Wallet className="mr-2 h-5 w-5" />
                                        Conectar a MetaMask
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Alert className="mb-6">
                                <Wallet className="h-4 w-4" />
                                <AlertTitle>Billetera Conectada</AlertTitle>
                                <AlertDescription>{address}</AlertDescription>
                            </Alert>

                            {isAdmin && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">
                                            Agregar nueva propuesta
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={newProposal}
                                                onChange={(e) =>
                                                    setNewProposal(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ingresar nombre de la propuesta"
                                                className="flex-grow"
                                            />
                                            <Button
                                                onClick={addProposal}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    "Agregando..."
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4" />
                                                        Agregar propuesta
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {proposals.length > 0 ? (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold">
                                            Propuestas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4">
                                            {proposals.map(
                                                (proposal, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center justify-between bg-secondary p-4 rounded-lg"
                                                    >
                                                        <span className="flex-grow">
                                                            <strong className="text-primary">
                                                                {proposal.name}
                                                            </strong>
                                                            <span className="ml-2 text-muted-foreground">
                                                                (
                                                                {proposal.votesCount.toString()}{" "}
                                                                votos)
                                                            </span>
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() =>
                                                                    vote(index)
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                {loading ? (
                                                                    "Votando..."
                                                                ) : (
                                                                    <>
                                                                        <Vote className="h-4 w-4" />
                                                                        Votar
                                                                    </>
                                                                )}
                                                            </Button>
                                                            {isAdmin && (
                                                                <Button
                                                                    onClick={() =>
                                                                        removeProposal(
                                                                            proposal.name
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    variant="destructive"
                                                                    size="sm"
                                                                >
                                                                    {loading ? (
                                                                        "Eliminando..."
                                                                    ) : (
                                                                        <>
                                                                            <Trash2 className="h-4 w-4" />
                                                                            Eliminar
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Alert>
                                    <AlertTitle>
                                        No hay ninguna propuesta
                                    </AlertTitle>
                                    <AlertDescription>
                                        No hay propuestas disponibles
                                    </AlertDescription>
                                </Alert>
                            )}

                            {isAdmin && (
                                <div className="mt-6 flex justify-center">
                                    <Button
                                        onClick={removeVote}
                                        disabled={loading}
                                        variant="secondary"
                                    >
                                        {loading ? (
                                            "Eliminando..."
                                        ) : (
                                            <>
                                                <XCircle className="h-4 w-4" />
                                                Eliminar Voto
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}

                    {errorMessage && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                    {notification && (
                        <Alert variant="default" className="mt-4">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{notification}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
