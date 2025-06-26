"use client";
import { account } from "@/app/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {  FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { Login, Register } from "../../lib/auth";
import { AuthenticationSchema } from "../../schema/authentication-schema";
import { FormAlert } from "@/components/form-message";
import { FileSchema, UploadFileSchema } from "../../schema/file-schema";
import { createFile } from "../../actions/file";
import { AppwriteException } from "appwrite";

/* const AuthenticationSchema = z.object({
  email : z.string()
    .min(2, {
      message: "Champs obligatoire",
    })
    .max(50, {
    message : "Champs obligatoire",
  }),
  password : z.string().min(5, {
    message : "Le mot de passe doit être supérieur à 5"
  }),
  name : z.string().min(2, {
      message: "Champs obligatoire",
    })
}) */



export default function Home() {

  const form = useForm<z.infer<typeof AuthenticationSchema>>({
    resolver : zodResolver(AuthenticationSchema),
    defaultValues : {
      email: "",
      password: "",
      name: "",
    }
  });


  const formUpload = useForm<z.infer<typeof UploadFileSchema>>({
    resolver : zodResolver(UploadFileSchema)
  });

  
  const [message, setMessage] = useState({
    type: "Default",
    title: "",
    description: "",
  });
  const [loggedInUser, setLoggedInUser] = useState<object | undefined>(undefined);
  const [isPending,startTransition] = useTransition();
  const [isLogin,setIsLogin] = useState<boolean>(true);
  const logout = async () => {
    await account.deleteSession("current");
    setLoggedInUser(undefined);
  }

  const onUploadFileSubmit = async (values : z.infer<typeof UploadFileSchema>) => {
      const file = values.file as File;
      const response  = await createFile(file);
      if(response instanceof AppwriteException) {
        setMessage((prev) => ({
          ...prev,
          type : "Error",
          title : response.type,
          description: response.message
        }));
        return;
      }
      console.log(response);
  };
  
  if(loggedInUser != undefined) {
    return<> <div className="border-b p-4 bg-white m">

      <div className="flex justify-between items-center ">
        <p>Bienvenu sur votre session {loggedInUser?.name}</p>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
      <div className="flex justify-center items-center max-h-max mt-40">
        
        <FormProvider {...formUpload}>
          <form onSubmit={formUpload.handleSubmit(onUploadFileSubmit)}>
            <Card className="w-[387px] p-4">
                <CardHeader>
                  <CardTitle>Enregistrer un fichier sur appwrite</CardTitle>
                  <CardDescription>
                    Pour enregistrer le fichier selectionner un fichier et téléverser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={formUpload.control}
                    name="file"
                    render={({field}) => (
                      <FormItem className="mb-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="file"
                            disabled={isPending}
                            placeholder="Selectionner un fichier"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                formUpload.setValue("file", file);
                              }
                            }}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    className="w-full hover:bg-blue-700 cursor-pointer">
                    Enregistrer un fichier</Button>
                </CardFooter>
            </Card>
          </form> 
          <FormAlert 
              className="w-[387px] hover:cursor-pointer"
              title="Fichier enregistré" 
              type="Success" 
              description="Fichier enregistré"/>
        </FormProvider>
      </div>
    </>
  }

  const onSubmit = (values: z.infer<typeof AuthenticationSchema>) => {
    startTransition(async () => {

      if (isLogin) {
        const userExisting = await Login(values);
        if(userExisting instanceof AppwriteException) {
          setMessage((prev) => ({
            ...prev,
            type : "Error",
            title : userExisting.type,
            description: userExisting.message
          }));
          return;
        }
        setLoggedInUser(userExisting as object);
        console.log({userExisting});
        
        if(userExisting === null){
          setMessage((prev) => ({
            ...prev,
            type : "Error",
            title : "Attention",
            description: "Erreur survenu..."
          }));
          return;
        }

        setMessage((prev) => ({
            ...prev,
            type : "Default",
            title : "",
            description: ""
          }));
        return;
      }
      
      const userRegister = await Register(values);
      setLoggedInUser(userRegister as object);
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <div className="flex flex-col gap-4 justify-center items-center max-h-max mt-40 ">
            <Card className="w-[387px]">
              <CardHeader>
                <CardTitle>
                    Authentification
                </CardTitle>
                <CardDescription>
                  Entrer votre email avant de vous connecter
                </CardDescription>
                <CardAction>
                    <Button
                      onClick={() => setIsLogin(!isLogin)}
                     variant={"link"}>
                        {isLogin ? "Créer un compte" : "Se connecter" }
                    </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                {!isLogin && <FormField
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem className="mb-4">
                      <FormLabel>{"Nom d'utilisateur"}</FormLabel>
                      <FormControl>
                        <Input 
                          id="name"
                          disabled={isPending}
                          placeholder="Gaius Ocklefort" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> }

                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                      <FormItem className="mb-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            id="email"
                            type="email"
                            disabled={isPending}
                            placeholder="gaiusYan11@gmail.com" 
                            {...field}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem className="mb-4">
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          id="password"
                          disabled={isPending}
                          placeholder="******" 
                          {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full hover:bg-blue-700 cursor-pointer"
                  type="submit">{isLogin ? "Se connecter" : "Créer un compte"}</Button>
              </CardFooter>
            </Card>
            <FormAlert 
              className="w-[387px] hover:cursor-pointer"
              title={message?.title} 
              type={message?.type} 
              description={message?.description}></FormAlert>
          </div>
        </div>
      </form>
  </FormProvider>
  );
}
