"use client";
import React, { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet, Plus, Trash2, Vote, XCircle } from "lucide-react";
import { contractABI, contractAddress } from "./datos";
import { useToast } from "@/hooks/use-toast";

export default function App() {
    const { toast } = useToast();
    const [address, setAddress] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [newProposal, setNewProposal] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [notification, setNotification] = useState("");
    const [instalar, setInstalar] = useState(false);

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

                toast({
                    variant: "success",
                    title: "Success",
                    description: "Conectado con éxito",
                });
                setInstalar(false);
            } else {
                setErrorMessage("MetaMask no está instalado");
                setInstalar(true);
            }
        } catch (error) {
            console.error("Error al conectar MetaMask:", error);
            if (error.code === -32002) {
                setErrorMessage("Inicie sesion en MetaMask para continuar");
            } else {
                setErrorMessage("Error al conectar MetaMask");
            }
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
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al obtener las propuestas",
            });
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
            toast({
                variant: "success",
                title: "Success",
                description: "Propuesta agregada con éxito.",
            });
        } catch (error) {
            console.error("Error al agregar propuesta:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al agregar propuesta.",
            });
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
            //setNotification("Propuesta eliminada con éxito.");
            toast({
                variant: "success",
                title: "Success",
                description: "Propuesta eliminada con éxito.",
            });
        } catch (error) {
            console.error("Error al eliminar propuesta:", error);
            //setErrorMessage("Error al eliminar propuesta.");
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al eliminar propuesta.",
            });
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
            toast({
                variant: "success",
                title: "Success",
                description: "Voto emitido con éxito.",
            });
        } catch (error) {
            console.error("Error al votar:", error);
            if (error.code === 4001 || error.code === "ACTION_REJECTED") {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error en la transacción.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Ya has votado.",
                });
            }
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
            toast({
                variant: "success",
                title: "Success",
                description: "Voto eliminado con éxito.",
            });
        } catch (error) {
            console.error("Error al eliminar voto:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Error al eliminar voto.",
            });
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
                    {instalar && (
                        <div className="mt-10">
                            <h1>Instrucciones para instalar MetaMask</h1>
                            <ul className="list-disc pl-5">
                                {/* Paso 1 */}
                                <li>
                                    <strong>Descargar MetaMask:</strong>
                                    <ul className="list-disc pl-5">
                                        <li>
                                            Visita la{" "}
                                            <a
                                                href="https://metamask.io/download.html"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                página oficial de MetaMask
                                            </a>
                                            .
                                        </li>
                                        <li>
                                            Selecciona tu navegador favorito
                                            (Chrome, Firefox, Edge, etc) o
                                            instala la aplicación para móvil.
                                        </li>
                                        <li>
                                            Haz clic en “Agregar a Chrome” o el
                                            navegador que uses para instalar la
                                            extensión.
                                        </li>
                                    </ul>
                                </li>

                                {/* Paso 2 */}
                                <li>
                                    <strong>Configurar MetaMask:</strong>
                                    <ul className="list-disc pl-5">
                                        <li>
                                            Abre la extensión después de
                                            instalarla.
                                        </li>
                                        <li>
                                            Crea una nueva billetera o importa
                                            una existente.
                                        </li>
                                        <li>
                                            Guarda tu frase de recuperación en
                                            un lugar seguro; no la compartas con
                                            nadie.
                                        </li>
                                    </ul>
                                </li>

                                {/* Paso 3 */}
                                <li>
                                    <strong>Activar redes de prueba:</strong>
                                    <ul className="list-disc pl-5">
                                        <li>
                                            Abre MetaMask y haz clic en el icono
                                            de tu cuenta en la esquina superior
                                            derecha.
                                        </li>
                                        <li>
                                            Selecciona “Configuración“ &gt;
                                            “Redes“ &gt; “Mostrar redes de
                                            prueba“. Actívalo para ver la red de
                                            prueba que necesitamos, en este caso
                                            <strong> Sepolia</strong>
                                        </li>
                                    </ul>
                                </li>

                                {/* Paso 4 */}
                                <li>
                                    <strong>
                                        Obtener fondos de prueba (faucet):
                                    </strong>
                                    <ul className="list-disc pl-5">
                                        <li>
                                            Elige la red de prueba{" "}
                                            <strong>Sepolia</strong> en MetaMask
                                        </li>
                                        <li>
                                            Visita{" "}
                                            <a
                                                href="https://cloud.google.com/application/web3/faucet"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Google Faucet
                                            </a>
                                        </li>
                                        <li>
                                            Ingresa la red de prueba{" "}
                                            <strong>Sepolia</strong> y dirección
                                            de tu billetera (disponible en
                                            MetaMask bajo tu nombre de cuenta) y
                                            solicita fondos de prueba.
                                        </li>
                                        <li>
                                            Espera unos minutos para que los
                                            fondos aparezcan en tu cuenta.
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
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
