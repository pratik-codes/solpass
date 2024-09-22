"use client"

import { useState, useEffect } from 'react'
import VaultCard from '@/components/dashboard/vault-card'
import PasswordDetails from '@/components/dashboard/password-details'
import { Skeleton } from "@/components/ui/skeleton";
import { uuid } from 'uuidv4';
import { Input } from '@/components/ui/input'
import PasswordEditAdd from "@/components/dashboard/add-edit-password";
import { encryptMessage, decryptMessage, decryptPrivateKey } from '@/lib/utils';


const mockData = {
    vault: {
      title: 'Main',
      desc: 'Manage your social media accounts',
      icon: 'Vault',
      passwords: [
        {
          id: uuid(),
          title: 'X',
          url: 'https://twitter.com',
          userName: 'user',
          email: 'johdoe@email.com',
          notes: 'This is a note',
          type: 'social',
          password: 'STRONG_PASSWORD', 
        },
        {
          id: uuid(),
          title: 'Facebook',
          url: 'https://facebook.com',
          userName: 'user',
          email: 'johdoe@email.com',
          notes: 'This is a note',
          type: 'social',
          password: 'STRONG_PASSWORD', 
        },
        {
          id: uuid(),
          title: 'Instagram',
          url: 'https://instagram.com',
          userName: 'user',
          email: 'johdoe@email.com',
          notes: 'This is a note',
          type: 'social',
          password: 'STRONG_PASSWORD', 
        },
        {
          id: uuid(),
          title: 'Github',
          url: 'https://github.com/',
          userName: 'user',
          email: 'johdoe@email.com',
          notes: 'This is a note',
          password: 'STRONG_PASSWORD', 
          type: 'social',
        },
      ],
    },
  }

export interface Link {
    title: string,
    url: string,
    userName: string,
    email: string,
    notes: string,
    type: string,
    password: string,
}

export default function Home() {
  const [keys, setKeys] = useState<any>({
    publicKey: sessionStorage.getItem('pbk') || '',
    privateKey: sessionStorage.getItem('pk') || '',
  })
  const [searchTerm, setSearchterm] = useState('')
  const [currentPassword, setCurrentPassword] = useState<any>({})
  const [data, setData] = useState<any>(mockData)

  const addLink = (link: Link) => {
    setData({
      ...data,
      vault: {
        ...data.vault,
        passwords: [
          ...data.vault.passwords,
          {
            id: uuid(),
            title: link.title,
            url: link.url,
            userName: link.userName,
            email: link.email,
            notes: link.notes,
            type: link.type,
            password: link.password,
          },
        ],
      },
    });
    encryptAndStoreData(data)
  }

  const editLink = (id: string, link: Link) => { setData({
      ...data,
      vault: {
        ...data.vault,
        passwords: data?.vault?.passwords.map((password: any) => {
          if (password.id === id) {
            return {
              id: password.id,
              title: link.title,
              url: link.url,
              userName: link.userName,
              email: link.email,
              notes: link.notes,
              type: link.type,
              password: link.password,
            };
          }
          return password;
        }),
      },
    });
    setCurrentPassword({ ...currentPassword, ...link })
    encryptAndStoreData(data)
  }

  const deleteLink = (id: string) => {
    setData({
      ...data,
      vault: {
        ...data.vault,
        passwords: data.vault.passwords.filter((password: any) => password.id !== id),
      },
    });
    if (currentPassword.id === id) {
      setCurrentPassword({})
    }
    encryptAndStoreData(data)
  }

  const setCurrentPasswordHandler = (id: string) => {
    const selectedPassword = data.vault.passwords.find(
      (password: any) => password.id === id
    );

    setCurrentPassword({...selectedPassword})
  }

  const encryptAndStoreData = (data: any) => {
    setTimeout(() => {
      const decryptedPublicKey = decryptPrivateKey(String(localStorage.getItem('pbk')) || "", process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "");
      const decryptedPrivateKey = decryptPrivateKey(String(localStorage.getItem('pk')) || "", process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "");
      const ecryptedData = encryptMessage(
        JSON.stringify(data),
        decryptedPublicKey || "",
        decryptedPrivateKey || ""
      );
      console.log("setting data", { ecryptedData, data })
      localStorage.setItem('data', ecryptedData)
    }, 1000)
  }

  useEffect(() => {
    const decryptedPublicKey = decryptPrivateKey(String(localStorage.getItem('pbk')) || "", process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "");
    const decryptedPrivateKey = decryptPrivateKey(String(localStorage.getItem('pk')) || "", process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "");
    const message = decryptMessage(
      String(localStorage.getItem("data")) || "",
      decryptedPublicKey || "",
      decryptedPrivateKey || ""
    );
    if (message) {
      setData(JSON.parse(message))
    }
  }, [])

  return (
    <div className="flex h-full">
      <div className="w-5/12 h-12/12 border-r ">
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Input
              onChange={(e) => setSearchterm(e.target.value)}
              placeholder="Search"
              className=""
            />
            <PasswordEditAdd
              type="add"
              vault={data.vault}
              addLink={(link: Link) => addLink(link)}
              editLink={(id: string, link: Link) => editLink(id, link)}
            />
          </div>
          {data?.vault?.passwords &&
            data?.vault?.passwords
              .filter((vault: any) =>
                vault.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vault.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vault.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vault.url.toLowerCase().includes(searchTerm.toLowerCase()) 
              )
              .map((vault: any, index: any) => (
                <VaultCard
                  title={vault.title}
                  url={vault.url}
                  userName={vault.userName}
                  email={vault.email}
                  notes={vault.notes}
                  key={vault.id}
                  id={vault.id}
                  type={vault.type}
                  setCurrentPasswordHandler={setCurrentPasswordHandler}
                  currentPassword={currentPassword}
                  deleteLink={(id: string) => deleteLink(id)}
                />
              ))}
        </div>
      </div>
      <div className="w-8/12 p-4">
        {currentPassword.id && (
          <PasswordDetails
            title={currentPassword?.title}
            url={currentPassword?.url}
            userName={currentPassword?.userName}
            email={currentPassword.email}
            notes={currentPassword.notes}
            key={currentPassword.id}
            id={currentPassword.id}
            type={currentPassword?.type}
            password={currentPassword?.password}
            vault={data.vault}
            editLink={(id: string, link: Link) => editLink(id, link)}
            deleteLink={(id: string) => deleteLink(id)}
          />
        )}
        {!currentPassword.id && (
          <div className="flex flex-col items-center justify-center mt-[8rem]">
            <div className="flex flex-col space-y-3">
              <div className="text-lg font-bold">NO DATA SELECTED</div>
              <Skeleton className="h-[225px] w-[350px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[350px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
