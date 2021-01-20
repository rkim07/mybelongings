const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const jwtSecret = 'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBbUNUdm1DS1FuTzZGcHNxWkFjVVJZcWcyTDU5cm45M0lOUmJKOW1vcVc0K000MkdaCjNhNzhqRGlCRkIwZ1RGSDdoRHZpRHRnZmlIM3VQOXA4VTlVSjB3OVgrb3YwRGNZYnR4TlQ0cG1YQmZ5RnRKcHYKbVg1OS84dFNNYWF5UG1QZGxMN0dUZHpZQTJZSVhBTWlCZHFKWFpsUXM2dHZLQWpxSWMzSEN2TExqaU5GYlJGRQpHQmZsN21abXZ2TVNwbkpxQ0FwSUpmaG4xOWZQNGdPa2tsbE95Z0xxa3UrWkF6cysxOC96cW1udVNnWXVuRTlQCm42ZmFLdHRub2tObUVPakM0M083aEhFUWFkWVlqRGtOTkwvdTRoZGVoakFFS2I1UUZ1RExERFJrNWVkdmxmT00KQk5WQzJ2eCtCdGgwYnBsa3Jsamg2VzdUQ3N5NWphamtnT0trblFJREFRQUJBb0lCQUQyVzVpN3QveUNvSmc2SgpBVHVJTFN1RThMcUNqS3pndVFWVXZsazBUUVZYclM3MitiU1YrOEkvdFhFUkFWd2o2Kzl4MW1jdjhrUHN4cCt1CnNKbTNLZ3o0cnlMTHVQWkNka0c4WHo3aDhoTUlVSS8xM0t1RVd6bExjM0NLREtuWS80QVJZbkZ1cnp0ZytJMVcKNzFUelRKeEpUalFOZUNmNnc5ei9VazRLVDRDd0FzRGFPYWdDZGNNeWVpK1NpV3ZHWFB2UGNaWjMyWmQ0KytUUgp2VGVuUlcrYkJhMFVYTlYwOEhrUUdnMFUrK3BoRzRoaXdaYzRzMlFPZmkwMlNnK09sSURlQTZZMTdnaXUyWlZiCi9maXdpcWFBUTRwOEQ0dGQ0YVJBdkliWVJMTXF6ZkxxVFh3TVFIV3Q4VFdBcTQwRjBlR2pEQWF0Y1BtbTA1UWwKdE9qejNzRUNnWUVBeVE5eWExbmQ2dWo1ajVEL0Q5VlljczV3MmxBWGZ0VjU1NzgrZ2ZGMVByR3pCeUJnTHdSUgphWkhadU5WajZ5U1VJVzVmVlEvemFLZExuNVIwVDNxZmJHc21lZ2VqSnFoY1diMGo4TEltcG9GblVLOHBzakxyCisxQnB0RVB6a1ZrMStQZm9ydHUyNHhaSGE2OWJwYU5MS2ZPbjA2WjZJK3RZb3hzL1QrdUhXSmtDZ1lFQXdiZTMKdDlFZWRtY0VkVzRZZzlPMWVCQVZVSVZ5Tmdtb0FGdWIzN1NxNDVWT2dZRXJTc3FKMGx2d0VBM29HOUVBdjVwTQpTU0NlRnVFQ0VUejlnbFdYSVk3Q3Zoa3YvT0FFWjhuQ2s0NzcxRTNTNkZETi9JT2MyQnBmaVd2NlBFQm96NzRPCmtNQzd3SFRpRm1GdGVXc3ovbFEwbWEzMFBsbExVUWR0R2hZL0dxVUNnWUVBaDBkVVpmUm1Rd3NUOXN2SlFaNzcKVHV1bHRNM1VzU3J6UmNGQVRtL213aE1QOE1pUXpyR3FFVXpuMzl2N3laZW43MEp5OUNteVRZVGFkZm1OdEhnOQowZFhhWXByRzVGaTlJa2dIYVlpRVJ0MmtaUDRtSU5id1BmeWgwbjh4MzJiVjBMa0Vucm9JT0l5aDYwdG1iM0VLClBxVEpFN2ZjVUZTbUk4Qk9mZmhyN1drQ2dZRUFuSkpMTVkwYUhBVUR1NDR5emtvTlFHOXZhdGVSQ2xBZnM3cFgKY0Nac2dPbXF2RTJVbWl5OTNJSm1zL01waVdJU1Fzc0pvWWwxZlhSNzRVYjBkNldLTTV0Wmw2QndBdWxsWmlYUwoyTVVXa2ZBYzZaeDJBUVMzZm90Q2NLWVBhU2QrRDNyRDl3ZHdPUXUvdU9zaU9xTUZNU2tLSXJSUTF4d0JIZ3JzCmljczFVZWtDZ1lCR1I4azI2V1dmMXdyT0hDWkhlL2NtZTZCb0h2TWR5K1V1VG11b3FpWGJDTmVzSlVXVmFTenAKMHZ6dXNUZUpJbXJ4bkpXdDBieldMUTFxR0NlZDBJNWRianh4eHY4Z2pkODNXaXZiZVRYQll4UE5Mb3N3SVpJQQpHVSt0bHBNMndZTUFVeng5cU96MmducUtNQ2E0QkU1U1VvSldUamQ1WWpEZWgxc2MwVjZTenc9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo='

const jwtHopefuls = {
    CREW_MANAGER: {
        firstName: 'Manager',
        lastName: 'Boss',
        versionSignature: '7fc8ba22-3ed9-45a5-9d52-a1e59b0dba7f',
        audience: 'web',
        lastPasswordReset: 1492629450000,
        identity: '1',
        authorities: [
            'ROLE_USER',
            'ROLE_CREW_MANAGER',
            'ROLE_CREW_STAFF'
        ],
        username: 'manager@manager.com'
    }, 
    CREW_STAFF: {
        firstName: 'Crew',
        lastName: 'Member',
        versionSignature: '7fc8ba22-3ed9-45a5-9d52-a1e59b0dba7f',
        audience: 'web',
        lastPasswordReset: 1492629450000,
        identity: '3',
        authorities: [
            'ROLE_CREW_STAFF'
        ],
        username: 'crew@member.com'
    },
    ADMIN_STAFF: {
        firstName: 'John',
        lastName: 'Doe',
        versionSignature: '5cb496f4-f0b7-4e9c-ac07-e36f8cb5860a',
        audience: 'web',
        lastPasswordReset: 1497441762000,
        identity: '4ee107f7-9fb1-4916-b304-e68362ed3b83',
        authorities: [
          'ROLE_USER',
          'ROLE_ADMIN'
        ],
        username: 'john.doe@example.com'
    },
    USER: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        versionSignature: '7fc8ba22-3ed9-45a5-9d52-a1e59b0dba7f',
        audience: 'web',
        lastPasswordReset: 1492629450000,
        identity: '5f84c9c0-f07b-45e0-8c4b-4d2e078a8d59',
        authorities: [
            'ROLE_USER'
        ],
        username: 'joe@bloggs.com'
    },
    ANONYMOUS_USER: {
        firstName: '',
        lastName: '',
        versionSignature: '7fc8ba22-3ed9-45a5-9d52-a1e59b0dba7f',
        audience: 'web',
        lastPasswordReset: 1492629450000,
        identity: 'anonymous',
        authorities: [
            'ROLE_ANONYMOUS'
        ],
        username: 'anonymousUser'
    }
}

const createWebToken = (tokenObj, privateKey = jwtSecret)  => {
    const privKey = Buffer.from(privateKey, 'base64').toString('utf8');
    const opts = { 
      algorithm: 'RS256'
    };

    if (tokenObj.exp === undefined) {
        opts.expiresIn = '100 days';
    }

    return jwt.sign(tokenObj, privKey, opts);
}

if (!fs.existsSync('./build')) {
    fs.mkdirSync('./build');
}

if (!fs.existsSync('./build/test')) {
    fs.mkdirSync('./build/test');
}

if (!fs.existsSync('./build/test/jwts')) {
    fs.mkdirSync('./build/test/jwts');
}

for (let key in jwtHopefuls) {
    let data = {
        jwt: createWebToken(jwtHopefuls[key])
    };
    fs.writeFileSync(path.join('./build/test/jwts', key + '.jwt'), JSON.stringify(data, null, 2));
}


