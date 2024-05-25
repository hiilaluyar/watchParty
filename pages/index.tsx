import Layout from "../components/Layout"
import { useState } from "react"
import InputText from "../components/input/InputText"
import Button from "../components/action/Button"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"
import useSWR from "swr"
import Image from "next/image"

export default function Index() {
  const router = useRouter()
  const { data } = useSWR("/api/stats", (url) =>
    fetch(url).then((r) => r.json())
  )
  const [room, setRoom] = useState("")

  return (
    <Layout meta={{ robots: "index, archive, follow" }} showNavbar={false}>
      <div className={"self-center flex justify-center"}>
        <form
          className={
            "flex flex-col gap-4 justify-center rounded shadow p-3 bg-dark-900 m-8"
          }
          onSubmit={async (e) => {
            e.preventDefault()

            if (room.length >= 4) {
              await router.push("/room/" + room)
            }
          }}
        >
          <h1 className={"text-2xl"}>Davet mi edildin?</h1>
          <InputText
            value={room}
            placeholder={"Oda Numarası"}
            onChange={(value) =>
              setRoom(value.toLowerCase().replace(/[^a-z]/g, ""))
            }
          />
          <div className={"flex gap-2 justify-end"}>
            <Button
              tooltip={"Create a new personal room"}
              className={"p-2"}
              actionClasses={
                "bg-primary-900 hover:bg-primary-800 active:bg-primary-700"
              }
              onClick={() => {
                fetch("/api/generate")
                  .then((r) => r.json())
                  .then(async ({ roomId }) => {
                    if (
                      typeof roomId === "string" &&
                      roomId.length >= 4 &&
                      roomId.match(/^[a-z]{4,}$/)
                    ) {
                      console.log("Generated new roomId:", roomId)
                      await router.push("/room/" + roomId)
                    } else {
                      throw Error("Invalid roomId generated: " + roomId)
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to generate new roomId", error)
                  })
              }}
            >
              Oda Oluştur
            </Button>
            <Button
              tooltip={room.length < 4 ? "Invalid room id" : "Join room"}
              className={"p-2"}
              actionClasses={
                room.length >= 4
                  ? "bg-primary-900 hover:bg-primary-800 active:bg-primary-700"
                  : "bg-dark-700 hover:bg-dark-600 active:bg-red-700 cursor-not-allowed"
              }
              disabled={room.length < 4}
              type={"submit"}
            >
              Odaya Katıl
            </Button>
          </div>
          <small className={"text-neutral-600"}>
            <div>Kullanan Kullanıcı sayısı :</div>
            <div className={"flex flex-row gap-2"}>
              <div>Odalar : {data?.rooms || 0}</div>
              <div>Aktif Kullanıcı: {data?.users || 0}</div>
            </div>
          </small>
          <Image
          src={"/logo_white.png"}
          alt={"Web-SyncPlay logo"}
          width={400}
          height={400}
        />
        </form>
        
      </div>

      <Tooltip
        style={{
          backgroundColor: "var(--dark-700)",
        }}
      />
    </Layout>
  )
}
