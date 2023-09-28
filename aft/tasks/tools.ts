import { IS_WINDOWS } from "../../os/mod.ts";
import { which } from "../../process/which.ts";
import { choco  } from "../../shell/choco/mod.ts";
import { install as installChoco } from "../../shell/choco/install.ts";
import { scriptRunner } from "../../shell/core/script_runner.ts";

export async function installTools() {

    if (IS_WINDOWS) {
        if (!await which("choco")) {
            await installChoco()
        }
    }

    if (!await which("docker")) {
        if (IS_WINDOWS) {
            await choco(["install", "docker-desktop", "-y"]).then(o => o.throwOrContinue());
        } else {
            scriptRunner.runScript("bash", `        
curl -fsSL https://get.docker.com -o ~/get-docker.sh
sudo sh ~/get-docker.sh
rm ~/get-docker.sh
sudo groupadd docker
sudo usermod -aG docker $USER
            `)
        }

        return;
    }

    if (!await which("mkcert")) {
        if (IS_WINDOWS) {
            await choco(["install", "mkcert", "-y"])
            .then(o => o.throwOrContinue());
        } else {
            scriptRunner.runScript("bash", `sudo apt install mkcert -y`);
        }
    }

    if (!await which("age")) {
        if (IS_WINDOWS) {
            await choco(["install", "age.portable", "-y"])
            .then(o => o.throwOrContinue());
        } else {
            scriptRunner.runScript("bash", `sudo apt install age -y`);
        }
    }

    if (!await which("sops")) {
        if (IS_WINDOWS) {
            await choco(["install", "age.portable", "-y"])
            .then(o => o.throwOrContinue());
        } else {
            scriptRunner.runScript("bash", `
                curl https://github.com/getsops/sops/releases/download/v3.8.0/sops_3.8.0_amd64.deb -o ~/sops.deb
                sudo dpkg -i ~/sops.deb
                rm ~/sops.deb
            `);
        }
    }
}