import type { NextPage } from "next";
import { useCallback, useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import toast from "react-hot-toast";
import { useWallet } from "contexts/WalletContext";

const transactionSchema = yup.object().shape({
  address: yup.string().nullable().required("Wallet address is required"),
  amount: yup.number().nullable().required("Amount is required").typeError("Must be a number"),
});

type TTransactionFormData = { address: string; amount: number };

const Wallet: NextPage = ({}) => {
  const form = useForm<TTransactionFormData>({
    resolver: yupResolver(transactionSchema),
  });
  const { register, handleSubmit, formState, setError } = form;

  const { provider, walletAddress, connect, ethBalance, sendETHs } = useWallet();

  const [haveMetamask, sethaveMetamask] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      } else {
        sethaveMetamask(true);
      }
    };
    checkMetamaskAvailability();
  }, []);

  const onSend = useCallback(
    async (formData: TTransactionFormData) => {
      if (ethBalance && formData.amount >= ethBalance) {
        setError("amount", { message: `Max amount is ${ethBalance}` });
        return;
      }

      try {
        setSending(true);
        const transReceipt = await sendETHs(formData.address, formData.amount);
        toast.success(`The transaction has been conducted successfully`)
      } catch (err) {
        toast.error("Sending the transaction has been failed");
      } finally {
        setSending(false);
      }
    },
    [ethBalance]
  );

  return (
    <>
      {!haveMetamask ? (
        <div className="text-danger text-center">Metamask is not installed</div>
      ) : !walletAddress ? (
        <div className="text-center">
          <div>Found MetaMask</div>
          <div>
            <Button variant="primary" onClick={connect}>
              Connect Wallet
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center">
            <p>
              Wallet Address: {walletAddress.slice(0, 4)}...
              {walletAddress.slice(38, 42)}
            </p>
            <h3></h3>
            <p>Balance: {ethBalance ? `${ethBalance.toFixed(5)} ETH` : "---"} </p>
          </div>

          <Row className="justify-content-center">
            <Col xs={12} sm={8} md={6}>
              <FormProvider {...form}>
                <Form onSubmit={handleSubmit(onSend)}>
                  <Card>
                    <Card.Body>
                      <Card.Title className="mb-4">Send ETHs</Card.Title>

                      <Row>
                        <Col>
                          <Form.Group className="mb-3" controlId="transactionForm.address">
                            <Form.Label>Public Address:</Form.Label>
                            <Form.Control {...register("address")} type="text" isInvalid={!!formState.errors.address} />
                            <Form.Control.Feedback type="invalid">{formState.errors.address?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col sm="auto" style={{ width: 120 }}>
                          <Form.Group className="mb-3" controlId="transactionForm.amount">
                            <Form.Label>Amount:</Form.Label>
                            <Form.Control {...register("amount")} isInvalid={!!formState.errors.amount} />
                            <Form.Control.Feedback type="invalid">{formState.errors.amount?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      {sending ? (
                        <div className="opacity-25 text-center">Sending the transaction...</div>
                      ) : (
                        <div>
                          <Button variant="primary" type="submit" disabled={!ethBalance}>
                            Send
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Form>
              </FormProvider>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Wallet;
